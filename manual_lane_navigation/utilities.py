import cv2
import math
import base64
import numpy as np


def BGR_to_HSV(frame):
    return cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)


def blue_mask(frame):
    return cv2.inRange(frame, np.array([70, 0, 0], np.uint8), np.array([150, 255, 255], np.uint8))


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
    if line_segments is None:
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

def calc_steering_angle(frame, lanes):
    if not lanes:
        return -1000

    height, width, _ = frame.shape

    if len(lanes) == 1:
        print('One lane detected')
        x1, _, x2, _ = lanes[0][0]
        x_offset = x2 - x1
    else:
        print('Two lanes detected')
        _, _, left_x2, _ = lanes[0][0]
        _, _, right_x2, _ = lanes[1][0]
        camera_offset = 0
        middle = int(width/2 * (1 + camera_offset))
        x_offset = (left_x2 + right_x2) / 2 - middle

    y_offset = int(height / 2)

    angle_rad = math.atan(x_offset / y_offset)
    angle_deg = int(angle_rad * 180 / math.pi)

    return angle_rad

def stabilize_steering(current, new, num_lanes, max_dev_two_lanes = 5, max_def_one_lane=1):
    if num_lanes == 2:
        max_dev = max_dev_two_lanes
    else:
        max_dev = max_dev_one_lane

    dev = new - current

    if abs(dev) > max_dev:
        stabilized_angle = current + max_dev
    else:
        stabilized_angle = new
    
    return stabilized_angle


def display_heading(frame, steering_angle, line_color=(0, 0, 255), line_width=5):
    heading_image = np.zeros_like(frame)
    height, width, _ = frame.shape
    steering_rad = (steering_angle + 90) / 180 * math.pi
    x1 = int(width / 2)
    y1 = height
    x2 = int(x1 - height / 2 / math.tan(steering_rad))
    y2 = int(height / 2)

    cv2.line(heading_image, (x1, y1), (x2, y2), line_color, line_width)
    heading_image = cv2.addWeighted(frame, 0.8, heading_image, 1, 1)

    return heading_image


def decode_image(image_str):
    data = image_str.split(',')[1]
    decoded_string = np.fromstring(base64.b64decode(data), np.uint8)
    decoded_image = cv2.imdecode(decoded_string, cv2.IMREAD_COLOR)
    return decoded_image