import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

const QRCodeComponent = ({ url, size = 200, className = '' }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (url && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) {
          console.error('Error generando QR:', error)
        }
      })
    }
  }, [url, size])

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-500 text-sm">URL requerida</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas 
        ref={canvasRef}
        className="border border-gray-200 rounded-lg"
      />
      <p className="text-xs text-gray-500 mt-2 text-center">
        Escanea para acceder al menú
      </p>
    </div>
  )
}

export default QRCodeComponent 