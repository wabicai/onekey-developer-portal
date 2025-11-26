'use client'

import Image from 'next/image'
import { Check, X } from 'lucide-react'

const devices = [
  {
    name: 'OneKey Classic 1s',
    image: '/icons/devices/classic1s.png',
    bluetooth: true,
    usb: true,
    description: 'Enhanced Classic with better display'
  },
  {
    name: 'OneKey Classic 1s Pure',
    image: '/icons/devices/classicPure.png',
    bluetooth: true,
    usb: true,
    description: 'Pure edition with minimal design'
  },
  {
    name: 'OneKey Mini',
    image: '/icons/devices/mini.png',
    bluetooth: false,
    usb: true,
    description: 'Compact USB-only wallet'
  },
  {
    name: 'OneKey Touch',
    image: '/icons/devices/touch.png',
    bluetooth: true,
    usb: true,
    description: 'Full touchscreen experience'
  },
  {
    name: 'OneKey Pro',
    image: '/icons/devices/pro.png',
    bluetooth: true,
    usb: true,
    description: 'Premium with biometric security'
  }
]

function SupportBadge({ supported }) {
  if (supported) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
        <Check className="w-4 h-4" />
        Supported
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
      <X className="w-4 h-4" />
      N/A
    </span>
  )
}

export function DeviceCompatibilityTable({ locale = 'en' }) {
  const isZh = locale === 'zh'

  const labels = {
    en: {
      subtitle: 'Support status for Bluetooth and USB connections',
      device: 'Device',
      bluetooth: 'Bluetooth',
      usb: 'USB',
    },
    zh: {
      subtitle: '蓝牙和 USB 连接的支持状态',
      device: '设备',
      bluetooth: '蓝牙',
      usb: 'USB',
    }
  }

  const t = labels[isZh ? 'zh' : 'en']

  return (
    <div className="my-6">
      {/* Subtitle only, no duplicate title */}
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
        {t.subtitle}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <th className="text-left py-4 px-5 font-semibold text-zinc-900 dark:text-white" style={{ width: '45%' }}>
                {t.device}
              </th>
              <th className="text-center py-4 px-5 font-semibold text-zinc-900 dark:text-white" style={{ width: '27.5%' }}>
                {t.bluetooth}
              </th>
              <th className="text-center py-4 px-5 font-semibold text-zinc-900 dark:text-white" style={{ width: '27.5%' }}>
                {t.usb}
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr
                key={device.name}
                className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30 group"
              >
                {/* Device Info */}
                <td className="py-4 px-5">
                  <div className="flex items-center gap-4">
                    {/* Device Image */}
                    <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
                      <Image
                        src={device.image}
                        alt={device.name}
                        width={48}
                        height={48}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    {/* Device Name & Description */}
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-white transition-colors">
                        {device.name}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {device.description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Bluetooth Support */}
                <td className="py-4 px-5 text-center">
                  <SupportBadge supported={device.bluetooth} />
                </td>

                {/* USB Support */}
                <td className="py-4 px-5 text-center">
                  <SupportBadge supported={device.usb} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DeviceCompatibilityTable
