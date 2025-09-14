"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { PostOrderModalProps } from "@/interface";
import uploadIcon from "@/assets/images/upload.png";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function PostOrderModal({ order, open, setOpen }: PostOrderModalProps) {
  const [formData, setFormData] = useState({
    paymentAmount: "",
    maturityPeriod: "360",
    paymentAsset: "USDT",
    targetQuantity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[650px] bg-transparent"
        onPointerDownOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="h-[44px] text-white text-[36px] leading-[44px] font-bold text-center">
            Post Buy Order
          </DialogTitle>
        </DialogHeader>

        <div className="mt-[62px] space-y-[29px]">
          <div className="flex space-x-[63px]">
            <div className="flex-1 flex items-center justify-between h-[59px] border-[1px] border-solid border-[#494949] rounded-[5px] p-[20px]">
              <label className="h-[17px] leading-[17px] text-[14px] text-[#848484]">TOKEN</label>
              <span className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]">Merlin</span>
            </div>
            <div className="w-[192px] flex items-center h-[59px] border-[1px] border-solid border-[#494949] rounded-[5px]">
              <Image src={uploadIcon} alt="" className="ml-[10px] mr-[20px] size-[47px]"/>
              <span className="h-[19px] leading-[19px] text-[16px] text-[#DEDEDE]">upload Logo</span>
            </div>
          </div>

          <div className="flex items-center justify-between h-[59px] border-[1px] border-solid border-[#494949] rounded-[5px] p-[20px]">
            <label className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Payment Amount</label>
            <Input
              type="number"
              placeholder="Payment Amount"
              className="flex-1 h-[19px] bg-transparent text-[#DEDEDE] !text-[16px] text-right px-[8px] border-none focus-visible:ring-0 shadow-none placeholder:text-[rgba(222,222,222,0.3)] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={formData.paymentAmount}
              onChange={(e) => setFormData({...formData, paymentAmount: e.target.value})}
            />
            <span className="text-[16px]">Merlin</span>
          </div>

          <div className="flex items-center justify-between h-[59px] border-[1px] border-solid border-[#494949] rounded-[5px] pl-[20px] py-[20px]">
            <label className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Maturity Period</label>
            <Select value={formData.maturityPeriod} onValueChange={(val: string) => setFormData({...formData, maturityPeriod: val})}>
              <SelectTrigger className="w-[auto] h-[36px] pr-[20px] gap-[20px] bg-transparent text-[#DEDEDE] text-[16px] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">
                <SelectItem className="px-[15px] py-[12px]" value="90">90 days</SelectItem>
                <SelectItem className="px-[15px] py-[12px]" value="180">180 days</SelectItem>
                <SelectItem className="px-[15px] py-[12px]" value="360">360 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between h-[59px] border-[1px] border-solid border-[#494949] rounded-[5px] pl-[20px] py-[20px]">
            <label className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Payment Asset</label>
            <Select value={formData.paymentAsset} onValueChange={(val: string) => setFormData({...formData, paymentAsset: val})}>
              <SelectTrigger className="w-[auto] h-[36px] pr-[20px] gap-[20px] bg-transparent text-[#DEDEDE] text-[16px] outline-none ring-0 shadow-none border-none focus:outline-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-[#4C4C4C]">
                <SelectItem className="px-[15px] py-[12px]" value="USDT">USDT</SelectItem>
                <SelectItem className="px-[15px] py-[12px]" value="Merlin">Merlin</SelectItem>
                <SelectItem className="px-[15px] py-[12px]" value="DUCK">DUCK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between h-[59px] border-[1px] border-solid border-[#494949] rounded-[5px] p-[20px]">
            <label className="h-[17px] leading-[17px] text-[14px] text-[#848484]">Target Quantity</label>
            <Input
              type="number"
              placeholder="Target Quantity"
              className="flex-1 h-[19px] bg-transparent text-[#DEDEDE] !text-[16px] text-right px-[8px] border-none focus-visible:ring-0 shadow-none placeholder:text-[rgba(222,222,222,0.3)] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={formData.targetQuantity}
              onChange={(e) => setFormData({...formData, targetQuantity: e.target.value})}
            />
            <span className="text-[16px]">{formData.paymentAsset}</span>
          </div>

          <div className="flex justify-between pt-[33px] px-[60px]">
            <motion.div
              className="w-[168px] h-[47px]"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 8px 25px rgba(255, 162, 0, 0.15)'
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                className="w-full h-full bg-gradient-orange border-none text-black text-[14px] font-bold hover:bg-gradient-orange hover:text-black"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </motion.div>
            <motion.div
              className="w-[168px] h-[47px]"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 8px 25px rgba(255, 162, 0, 0.15)'
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                className="w-full h-full bg-transparent text-white text-[14px] font-bold border-[1px] border-solid border-[#2C2C2C] rounded-[5px] hover:bg-transparent hover:text-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
