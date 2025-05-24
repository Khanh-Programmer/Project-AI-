document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const webcamFeed = document.getElementById("webcamFeed")
  const webcamOverlay = document.getElementById("webcamOverlay")
  const videoContainer = document.querySelector(".video-container")
  const startButton = document.getElementById("startButton")
  const supportButton = document.getElementById("supportButton")
  const homeButton = document.getElementById("homeButton")
  const verifyButton = document.getElementById("verifyButton")
  const statusMessage = document.getElementById("statusMessage")
  const studentInfo = document.getElementById("studentInfo")
  const placeholderInfo = document.getElementById("placeholderInfo")

  // Student info elements
  const studentAvatar = document.getElementById("studentAvatar")
  const studentName = document.getElementById("studentName")
  const studentId = document.getElementById("studentId")
  const studentRoom = document.getElementById("studentRoom")
  const accessTime = document.getElementById("accessTime")

  // Webcam stream
  let stream = null
  let isScanning = false

  // Initialize webcam
  async function initWebcam() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      })

      webcamFeed.srcObject = stream

      // Add a slight delay before hiding overlay for a smoother transition
      setTimeout(() => {
        webcamOverlay.style.opacity = "0"
        setTimeout(() => {
          webcamOverlay.classList.add("hidden")
          webcamOverlay.style.opacity = "1"
        }, 500)
      }, 1000)

      // Hide error message
      statusMessage.classList.add("hidden")

      // Update button text
      startButton.innerHTML = '<i class="fas fa-camera"></i><h3>Chụp ảnh</h3>'

      return true
    } catch (error) {
      console.error("Error accessing webcam:", error)

      // Show error message
      statusMessage.classList.remove("hidden")
      statusMessage.className = "status-message error-message"
      statusMessage.innerHTML =
        '<i class="fas fa-exclamation-circle"></i><p>Lỗi: Không thể truy cập webcam. Vui lòng kiểm tra quyền truy cập.</p>'

      return false
    }
  }

  // Stop webcam
  function stopWebcam() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      webcamFeed.srcObject = null

      // Show overlay with fade-in
      webcamOverlay.classList.remove("hidden")

      // Reset button text
      startButton.innerHTML = '<i class="fas fa-camera"></i><h3>Bắt đầu quét</h3>'

      // Remove scanning effects
      videoContainer.classList.remove("scanning")
      videoContainer.classList.remove("face-detection-active")
    }
  }

  // Start scanning animation
  function startScanningAnimation() {
    videoContainer.classList.add("scanning")
    videoContainer.classList.add("face-detection-active")
    isScanning = true
  }

  // Stop scanning animation
  function stopScanningAnimation() {
    videoContainer.classList.remove("scanning")
    videoContainer.classList.remove("face-detection-active")
    isScanning = false
  }

  // Capture image from webcam
  function captureImage() {
    if (!stream) return null

    const canvas = document.createElement("canvas")
    canvas.width = webcamFeed.videoWidth
    canvas.height = webcamFeed.videoHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(webcamFeed, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL("image/jpeg")
  }

  // Simulate face recognition (for demo purposes)
  function simulateRecognition(imageData) {
    return new Promise((resolve) => {
      // Show processing message
      statusMessage.classList.remove("hidden")
      statusMessage.className = "status-message warning-message"
      statusMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Đang xử lý nhận diện khuôn mặt...</p>'

      // Start scanning animation
      startScanningAnimation()

      // Simulate processing delay
      setTimeout(() => {
        // 80% chance of successful recognition for demo
        const success = Math.random() < 0.8

        // Stop scanning animation
        stopScanningAnimation()

        if (success) {
          resolve({
            success: true,
            student: {
              name: "Nguyễn Văn A",
              id: "SV12345",
              room: "A101",
              avatar: imageData,
            },
          })
        } else {
          resolve({
            success: false,
            message: "Không nhận diện được khuôn mặt hoặc sinh viên không có trong hệ thống.",
          })
        }
      }, 3000)
    })
  }

  // Display student information
  function displayStudentInfo(student) {
    studentAvatar.src = student.avatar
    studentName.textContent = student.name
    studentId.textContent = student.id
    studentRoom.textContent = student.room

    // Set current time
    const now = new Date()
    const timeString = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    const dateString = now.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    accessTime.textContent = `${timeString} - ${dateString}`

    // Hide placeholder with animation
    placeholderInfo.style.opacity = "0"
    setTimeout(() => {
      placeholderInfo.classList.add("hidden")

      // Show student info with animation
      studentInfo.classList.remove("hidden")
      studentInfo.style.opacity = "0"
      setTimeout(() => {
        studentInfo.style.opacity = "1"
      }, 50)
    }, 300)

    // Show success message
    statusMessage.classList.remove("hidden")
    statusMessage.className = "status-message success-message"
    statusMessage.innerHTML = '<i class="fas fa-check-circle"></i><p>Xác thực thành công!</p>'
  }

  // Event Listeners
  startButton.addEventListener("click", async () => {
    if (!stream) {
      // Start webcam
      const success = await initWebcam()
      if (!success) return
    } else if (!isScanning) {
      // Capture and process image
      const imageData = captureImage()
      if (!imageData) return

      // Process recognition
      const result = await simulateRecognition(imageData)

      if (result.success) {
        displayStudentInfo(result.student)
      } else {
        // Show error message
        statusMessage.classList.remove("hidden")
        statusMessage.className = "status-message error-message"
        statusMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i><p>${result.message}</p>`

        // Reset webcam for another try
        stopWebcam()
        await initWebcam()
      }
    }
  })

  supportButton.addEventListener("click", () => {
    alert("Đã gửi yêu cầu hỗ trợ. Nhân viên sẽ đến hỗ trợ bạn trong thời gian sớm nhất.")
  })

  homeButton.addEventListener("click", () => {
    // Navigate to home page
    window.location.href = "index.html"
  })

  verifyButton.addEventListener("click", () => {
    alert("Đã xác nhận sinh viên vào ký túc xá thành công!")

    // Reset the interface with animations
    stopWebcam()

    // Fade out student info
    studentInfo.style.opacity = "0"
    setTimeout(() => {
      studentInfo.classList.add("hidden")

      // Fade in placeholder
      placeholderInfo.classList.remove("hidden")
      placeholderInfo.style.opacity = "0"
      setTimeout(() => {
        placeholderInfo.style.opacity = "1"
      }, 50)

      statusMessage.classList.add("hidden")
    }, 300)
  })

  // Add transition styles
  studentInfo.style.transition = "opacity 0.3s ease"
  placeholderInfo.style.transition = "opacity 0.3s ease"
  webcamOverlay.style.transition = "opacity 0.5s ease"

  // Try to initialize webcam on page load
  initWebcam()
})
