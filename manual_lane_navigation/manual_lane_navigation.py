import cv2
from utilities import BGR_to_HSV, blue_mask

frame_raw = cv2.imread('/home/pi/test_image.jpg')

frame_hsv = BGR_to_HSV(frame_raw)

frame_blue_mask = blue_mask(frame_hsv)

cv2.imshow('blue_mask', frame_blue_mask)

cv2.waitKey(0) # waits until a key is pressed
cv2.destroyAllWindows() # destroys the window showing image