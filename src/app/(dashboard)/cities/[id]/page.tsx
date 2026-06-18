"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CityRedirect() {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      router.replace(`/sites/${id}`);
    } else {
      router.replace('/');
    }
  }, [id, router]);

  return null;
}
