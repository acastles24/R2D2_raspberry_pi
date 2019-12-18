import cv2
import numpy as np

def BGR_to_HSV(frame):
    return cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)


def blue_mask(frame):
    return cv2.inRange(frame, np.array([60, 40, 40]), np.array([150, 255, 255]))


def detect_edges(frame):
    return cv2.Canny(frame, 200, 400)


def crop_frame(frame, pct_height, pct_width):
    height, width = frame.shape
    mask = np.zeros_like(frame)

    polygon = np.array([[
        (0, height*pct_height/100),
        (width, height*pct_height/100),
        (width, height),
        (0, height)]],
        np.int32)

    cv2.fillPoly(mask, polygon, 255)
    return cv2.bitwise_and(frame, mask)

def line_segments(edges):
    rho = 1
    angle = np.pi/180
    votes = 10
    min_line_length = 8
    max_gap = 4
    return cv2.HoughLinesP(edges, rho, angle, votes, minLineLength=min_line_length, maxLineGap=max_gap)


def average_lines(frame, line_segments):
    lanes = []
    if len(line_segments) == 0:
        print('No lanes detected')
        return lanes
    
    height, width, _ = frame.shape
    left_lanes = []
    right_lanes = []

    #todo: check from camera images
    lane_detection_boundary = 1/3

    left_boundary = width * (1-lane_detection_boundary)
    right_boundary = width * lane_detection_boundary

    for segment in line_segments:
        for x1, y1, x2, y2 in segment:
            # disregard vertical line segments
            if x1 == x2:
                continue
            fit = np.polyfit((x1, x2), (y1, y2), 1)
            slope = fit[0]
            intercept = fit[1]
            if slope < 0:
                if x1 < left_boundary and x2 < left_boundary:
                    left_lanes.append((slope, intercept))
            else:
                if x1 > right_boundary and x2 > right_boundary:
                    right_lanes.append((slope, intercept))

    left_lane_average = np.average(left_lanes, axis=0)
    if len(left_lanes) > 0:
        lanes.append(generate_points(frame, left_lane_average))

    right_lane_average = np.average(right_lanes, axis=0)
    
    if len(right_lanes) > 0:
        lanes.append(generate_points(frame, right_lane_average))

    return lanes


def generate_points(frame, line):
    height, width, _ = frame.shape
    slope, intercept = line
    y1 = height
    y2 = int(y1 / 2)

    x1 = max(-width, min(2 * width, int((y1 - intercept) / slope)))
    x2 = max(-width, min(2 * width, int((y2 - intercept) / slope)))
    return [[x1, y1, x2, y2]]    

def display_lanes(frame, lanes, color=(0, 255, 0)):
    lane_image = np.zeros_like(frame)
    if lanes:
        for lane in lanes:
            for x1, y1, x2, y2 in lane:
                cv2.line(lane_image, (x1, y1), (x2, y2), color, 4)
    lane_image = cv2.addWeighted(frame, 0.8, lane_image, 1, 1)
    return lane_image