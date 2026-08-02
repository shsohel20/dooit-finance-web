import RuleDetail from '@/views/risk-rule-engine/rule-configuration/detail'

export default async function Page({ params }) {
  const { id } = await params
  return <RuleDetail id={id} />
}
