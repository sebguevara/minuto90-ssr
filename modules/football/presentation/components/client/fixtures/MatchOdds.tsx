// src/modules/football/presentation/fixtures/components/MatchOdds.tsx
'use client'

import React from 'react';
import { Match } from '@/modules/football/domain/models/fixture';
import { MatchOdds as MatchOddsData } from '@/modules/football/domain/models/odds';
import { Skeleton } from '@/modules/core/components/ui/skeleton';
import Image from 'next/image';

interface Props {
  match: Match;
  odds?: MatchOddsData;
  loading?: boolean;
}

export const MatchOdds = ({ match, odds, loading }: Props) => {
  if (loading) {
    return (
      <div className="mt-2 flex gap-1 justify-between rounded-md bg-background p-2 text-[10px]">
        <div className="flex gap-1">
          <Skeleton className="w-12 h-10 rounded-lg" />
          <Skeleton className="w-12 h-10 rounded-lg" />
          <Skeleton className="w-12 h-10 rounded-lg" />
        </div>
        <div className="flex items-center justify-center">
          <Skeleton className="w-18 h-8 rounded-lg" />
        </div>
      </div>
    );
  }

  const bookmaker = odds?.bookmakers[0];
  const matchWinnerMarket = bookmaker?.markets.find(m => m.id === '1');
  
  if (!matchWinnerMarket) return null;

  const home = matchWinnerMarket.values.find((v) => v.value === '1');
  const draw = matchWinnerMarket.values.find((v) => v.value === 'X');
  const away = matchWinnerMarket.values.find((v) => v.value === '2');

  const base = 'flex flex-col items-center justify-center px-1.5 py-1 rounded border bg-background/15 min-w-[42px] border-gray-600 text-sm';
  const isLive = !['FT', 'NS'].includes(match.status);
  const isFinished = match.status === 'FT';

  const btnVariant = isLive
    ? 'bet-btn bet-red bet-animate'
    : isFinished
    ? 'hidden'
    : 'bet-btn bet-blue bet-animate'

  return (
    <div className="mt-2 bg-background flex items-center justify-between gap-2 rounded-md p-2">
      <div className="flex items-center gap-1">
        <div className={base}>
          <span className="text-[9px] font-semibold opacity-60">1</span>
          <span className="text-[12px] leading-none">{home?.odd ?? '-'}</span>
        </div>
        <div className={base}>
          <span className="text-[9px] font-semibold opacity-60">X</span>
          <span className="text-[12px] leading-none">{draw?.odd ?? '-'}</span>
        </div>
        <div className={base}>
          <span className="text-[9px] font-semibold opacity-60">2</span>
          <span className="text-[12px] leading-none">{away?.odd ?? '-'}</span>
        </div>
      </div>
      <a href="#" target="_blank" rel="noopener noreferrer" className={btnVariant}>
         <span className="bet-face bet-label">APOSTAR</span>
         <span className="bet-face bet-logo">
           <div className="relative w-8 h-3.5">
             <Image src="/icons/1xbet.svg" alt="1xBet" fill sizes="32px" className="object-contain" />
           </div>
         </span>
       </a>
    </div>
  );
};