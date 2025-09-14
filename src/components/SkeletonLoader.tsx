"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  type?: "card" | "list" | "grid";
  count?: number;
}

// 骨架屏卡片组件
const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    className="border border-[#494949] rounded-[16px] p-[20px] animate-pulse"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
  >
    <div className="flex flex-col">
      {/* Token Header Skeleton */}
      <div className="flex justify-between">
        <div className="flex flex-col p-[10px]">
          <div className="size-[51px] bg-[#2A2A2A] rounded-lg loading-shimmer" />
          <div className="mt-[15px] h-[15px] w-[80px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[2px] h-[19px] w-[60px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[20px] h-[15px] w-[100px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[5px] h-[19px] w-[120px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>
        <div className="flex flex-col p-[10px]">
          <div className="h-[17px] w-[100px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[5px] h-[29px] w-[150px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[25px] h-[15px] w-[80px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[3px] h-[19px] w-[180px] bg-[#2A2A2A] rounded loading-shimmer" />

          {/* Progress Bar Skeleton */}
          <div className="mt-[25px] w-[163px] h-[10px] bg-[#2A2A2A] rounded-[30px] loading-shimmer" />
          <div className="mt-[5px] h-[15px] w-[80px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>
      </div>

      {/* Release Breakdown Skeleton */}
      <div className="mt-[26px] px-[10px]">
        <div className="h-[15px] w-[120px] bg-[#2A2A2A] rounded loading-shimmer" />
        <div className="mt-[5px] flex gap-[6px] items-center">
          <div className="size-[12px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="h-[18px] w-[150px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="h-[18px] w-[80px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>
        <div className="mt-[5px] flex gap-[6px] items-center">
          <div className="size-[12px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="h-[18px] w-[130px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="ml-[10px] mt-[26px] w-[87px] h-[37px] bg-[#2A2A2A] rounded-[30px] loading-shimmer" />
    </div>
  </motion.div>
);

// 骨架屏列表组件
const SkeletonList = ({ index }: { index: number }) => (
  <motion.div
    className="border border-[#494949] rounded-[16px] p-[20px] animate-pulse"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="size-[57px] bg-[#2A2A2A] rounded-lg loading-shimmer" />
        <div className="ml-[8px]">
          <div className="h-[17px] w-[100px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[5px] h-[19px] w-[80px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>
      </div>

      <div className="flex items-center space-x-[35px]">
        <div>
          <div className="h-[17px] w-[90px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[3px] h-[19px] w-[100px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>

        <div>
          <div className="h-[17px] w-[60px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[3px] h-[19px] w-[80px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>

        <div>
          <div className="h-[17px] w-[90px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[3px] h-[19px] w-[120px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>

        <div>
          <div className="h-[17px] w-[100px] bg-[#2A2A2A] rounded loading-shimmer" />
          <div className="mt-[3px] h-[19px] w-[80px] bg-[#2A2A2A] rounded loading-shimmer" />
        </div>

        <div className="w-[87px] h-[37px] bg-[#2A2A2A] rounded-[30px] loading-shimmer" />
      </div>
    </div>
  </motion.div>
);

// 主骨架屏组件
export default function SkeletonLoader({ type = "card", count = 9 }: SkeletonLoaderProps) {
  const skeletonItems = Array.from({ length: count }, (_, index) => index);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {type === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
          {skeletonItems.map((index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </div>
      )}

      {type === "list" && (
        <div className="flex flex-col gap-[15px]">
          {skeletonItems.map((index) => (
            <SkeletonList key={index} index={index} />
          ))}
        </div>
      )}

      {type === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] px-[15px]">
          {skeletonItems.map((index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// 简单的内联骨架屏组件
export const InlineSkeleton = ({
  width = "100%",
  height = "20px",
  className = ""
}: {
  width?: string;
  height?: string;
  className?: string;
}) => (
  <div
    className={`bg-[#2A2A2A] rounded loading-shimmer ${className}`}
    style={{ width, height }}
  />
);

// 按钮骨架屏组件
export const ButtonSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-[#2A2A2A] rounded-[30px] loading-shimmer ${className}`} />
);
