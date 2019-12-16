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
    if not line_segments:
        print('No lanes detected')
        return lanes
    
    height, width = frame.shape
    left_lanes = []
    right_lanes = []

    #todo: check from camera images
    lane_detection_boundary = 1/3

    left_boundary = width * (1-lane_detection_boundary)
    right_boundary = width * lane_detection_boundary

    for segment in line_segments:
        for x1, y1, x2, y2 in line_segments:
            # disregard vertical line segments
            if x1 == x2:
                continue
            fit = np.polyfit((x1, y1), (x2, y2))
            slope = fit[0]
            intercept = fit[1]
            if slope < 0:
                if x1 < left_boundary and x2 < left_boundary:
                    left_lanes.append((slope, intercept))
                else:
                    if x1 > right_boundary and x2 > right_boundary:
                        right_lanes.append((slope, intercept))
    left_lane_average = np.average(left_lanes, axis=0)
    