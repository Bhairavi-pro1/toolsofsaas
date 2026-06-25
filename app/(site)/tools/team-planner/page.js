import PageWrapper from '@/components/PageWrapper';
import TeamPlannerClient from './TeamPlannerClient';

export const metadata = {
  title: 'Random Team Generator & Multi-Day Planner',
  description:
    'Generate random teams instantly. Create schedules for multi-day events, classrooms, or team projects with teammate repeat penalty reduction.',
  keywords: [
    'team planner',
    'random team generator',
    'teammate generator',
    'multi-day planner',
    'group creator',
    'roster generator',
    'pairing algorithm',
  ],
  openGraph: {
    title: 'Random Team Generator & Multi-Day Planner - ToolsOfSaaS',
    description:
      'Generate random teams instantly. Prevent teammate repeats across multiple days.',
    url: '/tools/team-planner',
  },
  alternates: {
    canonical: '/tools/team-planner',
  },
};

export default function TeamPlannerPage() {
  return (
    <PageWrapper>
      <TeamPlannerClient />
    </PageWrapper>
  );
}
