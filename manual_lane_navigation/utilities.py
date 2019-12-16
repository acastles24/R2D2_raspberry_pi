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