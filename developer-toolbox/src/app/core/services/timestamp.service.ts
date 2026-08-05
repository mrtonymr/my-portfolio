import { Injectable } from '@angular/core';

export interface TimestampSnapshot {
  unixSeconds: number;
  unixMillis: number;
  iso: string;
  local: string;
  utc: string;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class TimestampService {
  fromUnixSeconds(seconds: number): TimestampSnapshot {
    return this.fromDate(new Date(seconds * 1000));
  }

  fromUnixMillis(millis: number): TimestampSnapshot {
    return this.fromDate(new Date(millis));
  }

  fromIso(iso: string): TimestampSnapshot | null {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return this.fromDate(date);
  }

  fromLocalInput(value: string): TimestampSnapshot | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return this.fromDate(date);
  }

  now(): TimestampSnapshot {
    return this.fromDate(new Date());
  }

  private fromDate(date: Date): TimestampSnapshot {
    return {
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMillis: date.getTime(),
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      date,
    };
  }
}
