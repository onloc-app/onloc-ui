import { DeleteUserButton } from "@/components"
import { useAuth } from "@/hooks/useAuth"

export default function DeleteAccountButton() {
  const auth = useAuth()

  if (!auth || !auth.user) return null

  return (
    <DeleteUserButton user={auth.user} isSelf={true} detailedButton={true} />
  )
}
