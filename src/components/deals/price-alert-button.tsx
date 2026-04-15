"use client";

import { FormEvent, useState } from "react";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";

interface PriceAlertButtonProps {
  productId: string;
}

export function PriceAlertButton({ productId }: PriceAlertButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const locale = useUiStore((state) => state.locale);
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
        {t(locale, "setPriceAlert")}
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t(locale, "createPriceAlert")}>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input
            type="number"
            required
            placeholder={t(locale, "targetPrice")}
            value={targetPrice}
            onChange={(event) => setTargetPrice(event.target.value)}
          />
          <Button variant="primary" type="submit">
            {t(locale, "saveAlert")}
          </Button>
        </form>
      </Modal>
    </>
  );
}
