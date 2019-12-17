import cv2
from utilities import BGR_to_HSV, blue_mask, detect_edges, crop_frame, line_segments, average_lines

def detect_lanes(frame_raw):
    frame_hsv = BGR_to_HSV(frame_raw)

    frame_blue_mask = blue_mask(frame_hsv)

    frame_edges = detect_edges(frame_blue_mask)

    edges_cropped = crop_frame(frame_edges, 50, 50)

    lines_detected = line_segments(edges_cropped)

    lanes = average_lines(frame_raw, lines_detected)

    return lanes


frame_raw = cv2.imread('/home/pi/test_image.jpg')

lanes = detect_lanes(frame_raw)

print(lanes)

# cv2.imshow('blue_mask', edges_cropped)

# cv2.waitKey(0) # waits until a key is pressed
# cv2.destroyAllWindows() # destroys the window showing image