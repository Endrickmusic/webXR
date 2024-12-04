import { useState, useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function WebcamFeed() {
  const [video] = useState(() => {
    const vid = document.createElement("video")
    vid.playsInline = true
    return vid
  })

  const [videoTexture] = useState(() => new THREE.VideoTexture(video))
  const materialRef = useRef()

  useEffect(() => {
    // Request webcam access and set up video stream
    navigator.mediaDevices
      .getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      .then((stream) => {
        video.srcObject = stream
        video.play()
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error)
      })

    // Cleanup
    return () => {
      const tracks = video.srcObject?.getTracks()
      tracks?.forEach((track) => track.stop())
      videoTexture.dispose()
    }
  }, [video, videoTexture])

  // Update video texture each frame
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.map.needsUpdate = true
    }
  })

  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial
        ref={materialRef}
        map={videoTexture}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
