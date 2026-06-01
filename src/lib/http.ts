import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Request failed";
  return NextResponse.json({ success: false, error: message }, { status });
}

