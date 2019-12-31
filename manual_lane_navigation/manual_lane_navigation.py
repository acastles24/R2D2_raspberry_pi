import cv2
import sys
from utilities import BGR_to_HSV, blue_mask, detect_edges, crop_frame, line_segments, average_lines, display_lanes, calc_steering_angle, display_heading, decode_image

def detect_lanes(frame_raw):
    frame_hsv = BGR_to_HSV(frame_raw)

    frame_blue_mask = blue_mask(frame_hsv)

    frame_edges = detect_edges(frame_blue_mask)

    edges_cropped = crop_frame(frame_edges, 65, 50)

    lines_detected = line_segments(edges_cropped)

    lanes = average_lines(frame_raw, lines_detected)

    lane_image = display_lanes(frame_raw, lanes)

    return lanes, lane_image

date_time = sys.argv[2]
frame_num = sys.argv[3]

raw_image = decode_image(sys.argv[1])

cv2.imwrite(f'/home/pi/R2D2_raspberry_pi/test_images/{date_time}_frame{frame_num}_raw.jpg', raw_image)

lanes, lane_image = detect_lanes(raw_image)

raw_angle = calc_steering_angle(raw_image, lanes)

lanes_heading_image = display_heading(lane_image, raw_angle)

cv2.imwrite(f'/home/pi/R2D2_raspberry_pi/test_images/{date_time}_frame{frame_num}_lanes.jpg', lanes_heading_image)

print(raw_angle)
sys.stdout.flush()