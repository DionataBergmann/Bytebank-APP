import { useState, useEffect, useRef } from 'react';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Hook reativo para busca com debounce usando RxJS
 * Demonstra programação reativa com Subject
 */
export function useReactiveSearch(
  debounceMs: number = 300,
  onSearch: (query: string) => void
): {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
} {
  const [searchQuery, setSearchQuery] = useState('');
  const searchSubjectRef = useRef<Subject<string> | null>(null);

  useEffect(() => {
    // Criar Subject para busca reativa
    const searchSubject = new Subject<string>();
    searchSubjectRef.current = searchSubject;

    // Subscription com debounce e distinctUntilChanged
    const subscription = searchSubject
      .pipe(
        debounceTime(debounceMs), // Aguarda Xms após última digitação
        distinctUntilChanged() // Só emite se o valor mudou
      )
      .subscribe({
        next: (query) => {
          onSearch(query);
        },
        error: (error) => {
          console.error('[useReactiveSearch] Erro:', error);
        },
      });

    // Cleanup
    return () => {
      subscription.unsubscribe();
      searchSubjectRef.current = null;
    };
  }, [debounceMs, onSearch]);

  // Função para atualizar busca de forma reativa
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchSubjectRef.current) {
      searchSubjectRef.current.next(query);
    }
  };

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
  };
}

