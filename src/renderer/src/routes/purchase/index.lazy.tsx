import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/purchase/')({
  component: Purchase
})

function Purchase(): JSX.Element {
  return <div></div>
}
