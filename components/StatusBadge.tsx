import { styleStatus } from '@/util/stylizers';

export default function StatusBadge({ status }: { status: string }) {
	const statusStyle = styleStatus(status);

	if (!statusStyle) return;

	return (
		<span
			className={`inline-flex h-fit w-fit items-center rounded-full ${statusStyle.bg} px-2 py-1 text-xs font-medium ${statusStyle.text} capitalize`}
		>
			{status}
		</span>
	);
}
