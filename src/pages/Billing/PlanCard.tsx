import type { ReactNode } from 'react';
import { CheckIcon } from '@/components/ui/icons';

interface PlanCardProps {
  title: string;
  price: string;
  priceUnit?: string;
  priceNote?: string;
  features: string[];
  /** 현재 이용 중인 요금제는 파란 테두리로 강조한다 */
  isCurrent?: boolean;
  /** 아직 판매하지 않는 요금제(EXPERT 등)는 내용을 블러 처리한다 */
  isBlurred?: boolean;
  footer?: ReactNode;
}

/** 요금제/상품 카드 (Figma '요금제/상품 소개') */
const PlanCard = ({
  title,
  price,
  priceUnit,
  priceNote,
  features,
  isCurrent = false,
  isBlurred = false,
  footer,
}: PlanCardProps) => (
  <section
    aria-hidden={isBlurred}
    className={`flex flex-col rounded-lg bg-white p-6 md:p-8 ${
      isCurrent ? 'border-4 border-blue-600' : 'border-4 border-transparent'
    } ${isBlurred ? 'pointer-events-none select-none blur-[6px]' : ''}`}
  >
    <h2 className="text-center text-lg font-extrabold text-[#191f28] md:text-xl">
      {title}
    </h2>
    <div className="mt-5 flex flex-1 flex-col rounded-lg border border-[#e5e8eb] p-5 md:p-6">
      <div className="rounded-md bg-[#eef4ff] px-4 py-6 text-center md:py-8">
        <p className="text-[#191f28]">
          <span className="text-3xl font-extrabold md:text-5xl">{price}</span>
          {priceUnit && (
            <span className="ml-2 text-lg font-bold md:text-xl">
              {priceUnit}
            </span>
          )}
        </p>
        {priceNote && (
          <p className="mt-2 text-base font-bold text-[#191f28] md:text-xl">
            {priceNote}
          </p>
        )}
      </div>
      <ul className="mt-6 space-y-1.5 px-1 md:px-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-1.5 text-sm text-[#333d4b] md:text-base"
          >
            <CheckIcon className="h-4 w-4 shrink-0 text-blue-600" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
    {footer && <div className="mt-5">{footer}</div>}
  </section>
);

export default PlanCard;
