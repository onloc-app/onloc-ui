import { type ApiError, patchTier } from "@/api"
import { DeleteTierButton, MaxDevicesField } from "@/components"
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
  Box,
  Button,
  Flex,
} from "@mantine/core"
import { mdiDrag } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

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
    <Box ref={setNodeRef} sx={sortableStyle} {...attributes}>
      <AccordionItem value={tier.id.toString()}>
        <AccordionControl {...listeners}>
          <Flex align="center" gap="xs">
            <Icon path={mdiDrag} size={1} color="gray" />
            <Box>{tier.name}</Box>
            <Box
              w="xs"
              h="xs"
              bg={stringToHexColor(tier.name)}
              sx={{ borderRadius: "50%" }}
            />
          </Flex>
        </AccordionControl>
        <AccordionPanel>
          <Flex direction="column" align="start" gap="xs">
            <MaxDevicesField value={maxDevices} onChange={setMaxDevices} />
            <Flex justify="space-between" w="100%">
              <DeleteTierButton tier={tier} />
              <Flex gap="xs">
                {tier.max_devices !== maxDevices ? (
                  <Button variant="subtle" onClick={handleReset}>
                    {t("components.tier_accordion.actions.reset")}
                  </Button>
                ) : null}
                <Button
                  loading={patchTierMutation.isPending}
                  disabled={tier.max_devices === maxDevices}
                  onClick={handleSave}
                >
                  {t("components.tier_accordion.actions.save")}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Box>
  )
}
