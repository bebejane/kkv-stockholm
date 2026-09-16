'use client';

import { authClient } from '@/auth/auth-client';
import DotLoader from '@/components/common/DotLoader';
import { SignUpToCourseForm } from '@/components/forms/SignUpToCourseForm';

export default function SignupToCourseSection({
	course,
	requiresLogin,
}: {
	course: CourseQuery['course'];
	requiresLogin: boolean;
}) {
	const { data: session, error, isPending } = authClient.useSession();

	if (!course) return null;
	if (requiresLogin) {
		if (isPending) return <DotLoader />;
		if (error) return <div className={'error'}>{error.message}</div>;
		if (!session?.user.id) return null;
	}

	return (
		<section className={'line margin-bottom'}>
			<header>
				<h2>Anmälan</h2>
				<SignUpToCourseForm courseId={course.id} />
			</header>
		</section>
	);
}
