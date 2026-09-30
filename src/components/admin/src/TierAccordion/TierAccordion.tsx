import { type ApiError, patchTier } from "@/api"
import { DeleteTierButton, MaxDevicesField, TierIndicator } from "@/components"
import { stringToHexColor } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Tier } from "@/types/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Text,
} from "@mantine/core"
import { mdiDrag } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./TierAccordion.module.css"

interface TierAccordionProps {
  tier: Tier
}

export default function TierAccordion({ tier }: TierAccordionProps) {
  const queryClient = useQueryClient()
  const auth = useAuth()
  const { t } = useTranslation()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tier.id.toString() })

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  }

  const patchTierMutation = useMutation({
    mutationFn: () => patchTier({ ...tier, max_devices: maxDevices }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiers"] })
      queryClient.invalidateQueries({ queryKey: ["admin_users"] })
    },
    onError: (error: ApiError) =>
      auth.throwMessage(error.message, Severity.ERROR),
  })

  const [maxDevices, setMaxDevices] = useState<number | null>(tier.max_devices)

  const handleReset = () => {
    setMaxDevices(tier.max_devices)
  }

  const handleSave = () => patchTierMutation.mutate()

  return (
    <div ref={setNodeRef} style={sortableStyle} {...attributes}>
      <AccordionItem value={tier.id.toString()}>
        <AccordionControl {...listeners}>
          <div className={classes["row"]}>
            <Icon path={mdiDrag} size={1} color="gray" />
            <Text>{tier.name}</Text>
            <TierIndicator tier={tier} />
          </div>
        </AccordionControl>
        <AccordionPanel>
          <div className={classes["content"]}>
            <MaxDevicesField value={maxDevices} onChange={setMaxDevices} />
            <div className={classes["content__actions"]}>
              <DeleteTierButton tier={tier} />
              <div className={classes["content__actions__right"]}>
                {tier.max_devices !== maxDevices && (
                  <Button variant="subtle" onClick={handleReset}>
                    {t("components.tier_accordion.actions.reset")}
                  </Button>
                )}
                <Button
                  loading={patchTierMutation.isPending}
                  disabled={tier.max_devices === maxDevices}
                  onClick={handleSave}
                >
                  {t("components.tier_accordion.actions.save")}
                </Button>
              </div>
            </div>
          </div>
        </AccordionPanel>
      </AccordionItem>
    </div>
  )
}
