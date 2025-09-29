import StudyBuddyClient from '@/components/study-buddy-client';

export default function Home() {
  return (
    <main className="h-screen w-screen bg-secondary/30 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <StudyBuddyClient />
    </main>
  );
}
