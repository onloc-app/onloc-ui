import { stringToHexColor } from "@/helpers/utils"
import type { Tier } from "@/types/types"
import { Box, Group, Select } from "@mantine/core"
import { mdiCheck } from "@mdi/js"
import Icon from "@mdi/react"

interface TierSelectProps {
  currentTier: Tier
  tiers: Tier[]
  onTierChange: (tier: Tier) => void
}

export default function TierSelect({
  currentTier,
  tiers,
  onTierChange,
}: TierSelectProps) {
  const handleChange = (newTierId: string | null) => {
    const tier = tiers.find((tier) => tier.id.toString() === newTierId)
    if (tier) {
      onTierChange(tier)
    }
  }

  const options =
    tiers.map((tier) => ({
      label: tier.name,
      value: tier.id.toString(),
    })) || null

  return (
    <Select
      value={currentTier.id.toString()}
      data={options}
      onChange={handleChange}
      leftSection={
        <Box
          w="xs"
          h="xs"
          bg={stringToHexColor(currentTier.name)}
          sx={{ borderRadius: "50%" }}
        />
      }
      renderOption={({ option, checked }) => {
        return (
          <Group justify="space-between" w="100%">
            <Group>
              <Box
                w="xs"
                h="xs"
                bg={stringToHexColor(option.label)}
                sx={{ borderRadius: "50%" }}
              />
              {option.label}
            </Group>
            <Group>
              {checked ? <Icon path={mdiCheck} size={0.75} /> : null}
            </Group>
          </Group>
        )
      }}
    />
  )
}
