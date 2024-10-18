import cv2
import threading
import time


class RTSPService:
    def __init__(self, rtsp_url):
        self.rtsp_url = rtsp_url
        self.capture = None
        self.is_streaming = False
        self.stream_thread = None
        self.lock = threading.Lock()

    def start(self, poi: str):
        if not self.is_streaming:
            self.is_streaming = True
            self.capture = cv2.VideoCapture(self.rtsp_url)

            if not self.capture.isOpened():
                print("Error: Unable to open RTSP stream.")
                self.is_streaming = False
                return

            # Start the streaming thread
            self.stream_thread = threading.Thread(target=self.stream_generator, name=poi)
            self.stream_thread.start()

    def stream_generator(self):
        while self.is_streaming:
            try:
                with self.lock:  # Lock access to capture
                    if self.capture.isOpened():
                        success, frame = self.capture.read()
                        if success:
                            frame = cv2.resize(frame, (640, 361))
                            _, jpeg = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
                            yield (b'--frame\r\n'
                                   b'Content-Type: image/jpeg\r\n\r\n' +
                                   jpeg.tobytes() + b'\r\n')
                        else:
                            print("Failed to read frame")
                            break
                    else:
                        time.sleep(1)
            except Exception as e:
                print(f"Error in stream_generator: {e}")
                break

        # Release the capture object after the loop
        with self.lock:
            if self.capture is not None:
                self.capture.release()
                self.capture = None  # Reset capture to None
                print("Capture released.")

    def stop(self):
        if self.is_streaming:
            self.is_streaming = False  # Set flag to stop streaming

            # Wait for the streaming thread to finish
            if self.stream_thread is not None:
                self.stream_thread.join(timeout=2)
                self.stream_thread = None  # Reset the thread reference

            # Release the capture object
            with self.lock:
                if self.capture is not None:
                    self.capture.release()
                    self.capture = None  # Reset capture to None
                    print("Capture released in stop.")
