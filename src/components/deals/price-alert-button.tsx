"use client";

import { FormEvent, useState } from "react";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useUserStore } from "@/store/user-store";

interface PriceAlertButtonProps {
  productId: string;
}

export function PriceAlertButton({ productId }: PriceAlertButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const addAlert = useUserStore((state) => state.addAlert);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!targetPrice) return;

    addAlert({
      id: crypto.randomUUID(),
      productId,
      targetPrice: Number(targetPrice),
      createdAt: new Date().toISOString()
    });
    setTargetPrice("");
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <BellRing className="h-4 w-4" />
        Set Price Alert
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Price Alert">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input
            type="number"
            required
            placeholder="Target price"
            value={targetPrice}
            onChange={(event) => setTargetPrice(event.target.value)}
          />
          <Button variant="primary" type="submit">
            Save Alert
          </Button>
        </form>
      </Modal>
    </>
  );
}
