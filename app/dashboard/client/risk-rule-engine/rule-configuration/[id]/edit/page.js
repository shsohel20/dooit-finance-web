import RuleEdit from '@/views/risk-rule-engine/rule-configuration/edit'

export default async function Page({ params }) {
  const { id } = await params
  return <RuleEdit id={id} />
}
