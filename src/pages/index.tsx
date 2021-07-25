import Link from 'next/link';

export default function Index() {
	return (
		<main>
			<Link href="/auth/signin">
				<a>Sign In</a>
			</Link>
			<Link href="/auth/signup">
				<a>Sign Up</a>
			</Link>
			<div data-testid="text">Building a Personal Blog Post in Next Js With TDD</div>
		</main>
	);
}
