import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/course-data";
import { LessonViewer } from "@/components/lesson-viewer";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = courses.find(c => c.id === id);
  if (!course) notFound();
  return <main className="container py-12 max-w-4xl"><Link href="/courses" className="text-blue-700 font-bold text-sm">← All courses</Link><div className="mt-6"><div className="text-blue-700 text-sm font-bold">{course.subject} · {course.level}</div><h1 className="text-4xl font-black mt-2">{course.title}</h1><p className="text-slate-600 mt-3">{course.description}</p></div><div className="card p-6 md:p-8 mt-8"><LessonViewer courseId={course.id} lessons={course.lessons}/></div></main>;
}
