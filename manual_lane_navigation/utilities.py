import cv2
import numpy as np

def BGR_to_HSV(frame):
    return cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)


def blue_mask(frame):
    return cv2.inRange(frame, np.array([60, 40, 40]), np.array([150, 255, 255]))