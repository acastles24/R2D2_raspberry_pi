import cv2
import sys
from utilities import BGR_to_HSV, blue_mask, detect_edges, crop_frame, line_segments, average_lines, display_lanes, calc_steering_angle, display_heading

def detect_lanes(frame_raw):
    frame_hsv = BGR_to_HSV(frame_raw)

    frame_blue_mask = blue_mask(frame_hsv)

    frame_edges = detect_edges(frame_blue_mask)

    edges_cropped = crop_frame(frame_edges, 50, 50)

    lines_detected = line_segments(edges_cropped)

    lanes = average_lines(frame_raw, lines_detected)

    lane_image = display_lanes(frame_raw, lanes)

    return lanes, lane_image

# frame_raw = cv2.imread('/home/pi/test_image.jpg')

lanes, lane_image = detect_lanes(sys.argv)

raw_angle = calc_steering_angle(frame_raw, lanes)

lanes_heading_image = display_heading(lane_image, raw_angle)

# cv2.imshow('lanes', lanes_heading_image)

# cv2.waitKey(0) # waits until a key is pressed
# cv2.destroyAllWindows() # destroys the window showing image

print(lanes_heading_image, raw_angle)
sys.stdout.flush()