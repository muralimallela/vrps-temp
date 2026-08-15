import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(error: unknown, status = 400) {
  let message = "Request failed";
  if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object") {
    const errObj = error as any;
    message = errObj.message || errObj.error || errObj.type || JSON.stringify(error);
  }
  return NextResponse.json({ success: false, error: message }, { status });
}
