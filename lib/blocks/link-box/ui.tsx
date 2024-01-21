import { CoreBlock } from '@/app/components/CoreBlock';
import Link from 'next/link';
import { LinkBoxBlockConfig } from './types';

export function LinkBox({ title, label, link }: LinkBoxBlockConfig) {
  return (
    <CoreBlock>
      <Link href={link} target="_blank" rel="noopener noreferrer">
        <div className="flex flex-col gap-2">
          <div className="w-12 h-12 rounded-md bg-gray-600"></div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-stone-900">
              {title}
            </span>
            <span className="text-stone-600 text-sm">{label}</span>
          </div>
        </div>
      </Link>
    </CoreBlock>
  );
}
