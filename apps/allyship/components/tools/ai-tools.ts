import axios from 'axios';
import { BaseTool } from './tools/base-tool';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const AI_AGENTS_INSTRUCTIONS = {
  readabilityAgent: {
    role: "Text Readability Analysis",
    instruction: `You are an expert in text readability analysis. Your task is to evaluate the readability level of the provided text using the Flesch-Kincaid Grade Level scale.

    CRITICALLY IMPORTANT: 
    1. Analyze the text in the language it is written in
    2. DO NOT translate the text to other languages
    3. Use readability metrics appropriate for the text's language
    4. Return the result STRICTLY in JSON format:
    {
      "score": number,
      "explanation": "Brief explanation of the score (up to 100 characters)",
      "details": ["List of complex words, terms, and sentences with specific examples in quotes"]
    }
    
    Scoring categories:
    - Basic (1-6): Text is easy to read, suitable for a wide audience
    - Average (7-12): Text of medium complexity, requires basic education
    - Skilled (13+): Complex text, requires higher education

    In your analysis, consider:
    1. Sentence length
    2. Complexity of words used
    3. Overall text structure
    4. Presence of specialized terminology
    
    IMPORTANT: When listing complex words or sentences in the "details" array, ALWAYS include specific examples in quotes. For example:
    - "Complex terminology includes terms like 'algorithm', 'infrastructure', and 'implementation'"
    - "Long sentences such as 'This sentence contains multiple clauses and extends beyond what is considered optimal for readability'"`,
  }
};

export class ReadabilityTool extends BaseTool {
  protected isActive: boolean = false;
  protected addedElements: Set<HTMLElement> = new Set();
  private analysisResults: Map<HTMLElement, { score: number; explanation: string; details: string[] }> = new Map();
  private totalScore: number | null = null;
  private minParagraphLength: number = 50;
  private analysisQueue: Set<HTMLElement> = new Set();
  private processingElement: HTMLElement | null = null;
  private analyzedTexts: Set<string> = new Set();
  // Кэш результатов анализа по тексту
  private resultsCache: Map<string, { score: number; explanation: string; details: string[] }> = new Map();
  // Счетчик использования кэша
  private cacheHits: number = 0;

  constructor() {
    super();
    // Проверяем, что document существует (для SSR)
    if (typeof document !== 'undefined') {
    this.addStyles();
    }
  }

  private addStyles(): void {
    // Проверяем, что document существует (для SSR)
    if (typeof document === 'undefined') return;
    
    const styles = document.createElement('style');
    styles.textContent = `
      .readability-result-container {
        position: relative;
        margin: 1em 0;
        padding-right: 4.5em;
      }
      .readability-indicator {
        position: absolute;
        right: 0;
        top: 0;
        min-width: 3.5em;
        padding: 0.5em;
        border-radius: 0.5em;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 40;
        border: 2px solid rgba(255,255,255,0.2);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .readability-indicator:hover {
        transform: scale(1.05);
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      }
      .readability-tooltip {
        position: absolute;
        right: 100%;
        top: 0;
        width: 300px;
        background: #121212;
        color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        padding: 12px;
        margin-right: 10px;
        z-index: 50;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        font-size: 13px;
        max-height: 400px;
        overflow-y: auto;
      }
      .readability-indicator:hover .readability-tooltip {
        opacity: 1;
        visibility: visible;
      }
      .readability-tooltip ul {
        margin: 0;
        padding-left: 16px;
      }
      .readability-tooltip li {
        margin-bottom: 4px;
        color: #e0e0e0;
      }
      .readability-tooltip .complex-word {
        color: #ff5252;
        font-weight: 500;
      }
      .readability-tooltip .complex-sentence {
        color: #ff5252;
        font-weight: 500;
      }
      .total-score-modal {
        animation: fadeIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: #121212;
        color: #ffffff;
      }
      .total-score-modal .progress-bar {
        height: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        overflow: hidden;
      }
      .total-score-modal .progress-bar-fill {
        height: 100%;
        transition: width 0.3s ease;
      }
      .total-score-modal .score-section {
        padding: 12px;
        margin: 8px 0;
        border-radius: 8px;
        transition: background-color 0.2s ease;
      }
      .total-score-modal .score-section:hover {
        background-color: rgba(255,255,255,0.05);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .readability-score {
        font-size: 1.4em;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
        position: relative;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .readability-score::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
        opacity: 0;
        animation: glow 2s infinite;
      }
      @keyframes glow {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
      .readability-explanation {
        font-size: 0.9em;
        font-weight: 500;
        color: #333;
        margin-top: 0.2em;
        white-space: nowrap;
      }
      .readability-details {
        font-size: 0.8em;
        color: #666;
        margin-top: 0.1em;
      }
      .readability-loading {
        background: #121212;
        border-color: #ffeeba;
        color: #ffeeba;
      }
      .readability-error {
        background: #121212;
        border-color: #f5c6cb;
        color: #f5c6cb;
      }
      .table-wrapper .readability-indicator {
        position: absolute;
        right: -4.5em;
        top: 0;
      }
    `;
    document.head.appendChild(styles);
  }

  getSelector(): string {
    return `
      article > p,
      article > section > p,
      .prose > p,
      .content > p,
      [class*="article"] > p,
      [class*="content"] > p,
      [class*="post"] > p,
      article > h1, article > h2, article > h3, article > h4, article > h5, article > h6,
      section > h1, section > h2, section > h3, section > h4, section > h5, section > h6,
      article > ul, article > ol,
      section > ul, section > ol,
      .prose > ul, .prose > ol,
      .content > ul, .content > ol,
      article table, section table, .prose table, .content table,
      [class*="article"] table, [class*="content"] table, [class*="post"] table,
      .table, .data-table, [class*="table"]
    `.trim();
  }

  getElements(): NodeListOf<HTMLElement> {
    // Проверяем, что document существует (для SSR)
    if (typeof document === 'undefined') return [] as unknown as NodeListOf<HTMLElement>;
    
    return document.querySelectorAll<HTMLElement>(this.getSelector());
  }

  private logStatus(message: string, data?: any) {
    const timestamp = new Date().toISOString().split('T')[1];
    console.log(
      `%c[Readability Tool ${timestamp}] ${message}`,
      'color: #0066cc',
      data ? {
        ...data,
        parentInfo: data.element ? {
          tag: data.element?.tagName,
          parentTag: data.element?.parentElement?.tagName,
          parentClass: data.element?.parentElement?.className,
          isArticle: !!data.element?.closest('article'),
          isContent: !!data.element?.closest('[class*="content"]'),
          path: this.getElementPath(data.element)
        } : undefined
      } : ''
    );
  }

  private getElementPath(element: HTMLElement | null): string {
    if (!element) return '';
    const path: string[] = [];
    let current: HTMLElement | null = element;
    while (current && current.tagName !== 'BODY') {
      path.unshift(`${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ''}${current.className ? `.${current.className.split(' ').join('.')}` : ''}`);
      current = current.parentElement;
    }
    return path.join(' > ');
  }

  private getContentElements(): HTMLElement[] {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(this.getSelector()));
    this.logStatus('Found all elements:', { count: elements.length });

    // Предварительная обработка таблиц
    const processedElements: HTMLElement[] = [];
    elements.forEach(el => {
      // Если это таблица или её часть
      if (el.tagName.toLowerCase() === 'table' || 
          el.closest('table') || 
          el.classList.toString().toLowerCase().includes('table')) {
        
        // Находим корневую таблицу
        const rootTable = el.closest('table') || el;
        
        // Если эта таблица ещё не обработана
        if (!processedElements.includes(rootTable as HTMLElement)) {
          processedElements.push(rootTable as HTMLElement);
          this.logStatus('Table added:', {
            element: rootTable,
            content: rootTable.textContent?.trim().substring(0, 100) + '...'
          });
        }
      } else {
        processedElements.push(el);
      }
    });

    // Группируем элементы с заголовками
    const combinedElements: HTMLElement[] = [];
    let currentGroup: HTMLElement[] = [];
    let currentGroupText = '';
    let hasHeading = false;

    processedElements.forEach((el, index) => {
      const text = el.textContent?.trim() || '';
      const isHeading = /^h[1-6]$/.test(el.tagName.toLowerCase());
      const isList = el.tagName.toLowerCase() === 'ul' || el.tagName.toLowerCase() === 'ol';
      const isTable = el.tagName.toLowerCase() === 'table' || el.classList.toString().toLowerCase().includes('table');
      
      // Если это таблица или список, обрабатываем как единый элемент
      if (isList || isTable) {
        // Если была предыдущая группа, сохраняем её
        if (currentGroupText.length >= this.minParagraphLength && currentGroup.length > 0 && currentGroup[0]?.parentElement) {
          const container = document.createElement('div');
          container.className = 'combined-paragraphs';
          const parent = currentGroup[0].parentElement;
          parent.insertBefore(container, currentGroup[0]);
          currentGroup.forEach(el => container.appendChild(el));
          combinedElements.push(container);
        }
        
        // Добавляем список/таблицу как отдельный элемент
        if (text.length >= this.minParagraphLength) {
          const wrapper = document.createElement('div');
          wrapper.className = isTable ? 'table-wrapper' : 'list-wrapper';
          el.parentElement?.insertBefore(wrapper, el);
          wrapper.appendChild(el);
          combinedElements.push(wrapper);
          
          this.logStatus(`Added ${isTable ? 'table' : 'list'}:`, {
            element: el,
            length: text.length,
            words: text.split(/\s+/).length
          });
        }
        
        currentGroup = [];
        currentGroupText = '';
        hasHeading = false;
      }
      // Если это заголовок, начинаем новую группу
      else if (isHeading) {
        if (currentGroupText.length >= this.minParagraphLength && currentGroup.length > 0 && currentGroup[0]?.parentElement) {
          const container = document.createElement('div');
          container.className = 'combined-paragraphs';
          const parent = currentGroup[0].parentElement;
          parent.insertBefore(container, currentGroup[0]);
          currentGroup.forEach(el => container.appendChild(el));
          combinedElements.push(container);
        }
        
        currentGroup = [el];
        currentGroupText = text;
        hasHeading = true;
      } else {
        currentGroup.push(el);
        currentGroupText += ' ' + text;
        
        const nextEl = elements[index + 1];
        const isNextHeading = nextEl && /^h[1-6]$/.test(nextEl.tagName.toLowerCase());
        const isNextListOrTable = nextEl && (
          nextEl.tagName.toLowerCase() === 'ul' || 
          nextEl.tagName.toLowerCase() === 'ol' ||
          nextEl.tagName.toLowerCase() === 'table'
        );
        
        if (!nextEl || isNextHeading || isNextListOrTable) {
          if (currentGroupText.length >= this.minParagraphLength && currentGroup[0]?.parentElement) {
            const container = document.createElement('div');
            container.className = 'combined-paragraphs';
            const parent = currentGroup[0].parentElement;
            parent.insertBefore(container, currentGroup[0]);
            currentGroup.forEach(el => container.appendChild(el));
            combinedElements.push(container);
          }
          currentGroup = [];
          currentGroupText = '';
          hasHeading = false;
        }
      }
    });

    // Обработка последней группы
    if (currentGroupText.length >= this.minParagraphLength && currentGroup.length > 0 && currentGroup[0]?.parentElement) {
      const container = document.createElement('div');
      container.className = 'combined-paragraphs';
      const parent = currentGroup[0].parentElement;
      parent.insertBefore(container, currentGroup[0]);
      currentGroup.forEach(el => container.appendChild(el));
      combinedElements.push(container);
    }

    const filteredElements = combinedElements.filter(el => {
      const text = el.textContent?.trim() || '';
      
      if (text.length < this.minParagraphLength) {
        this.logStatus('Element skipped: insufficient length', { 
          element: el, 
          length: text.length,
          minRequired: this.minParagraphLength
        });
        return false;
      }

      const isPartOfArticle = el.closest('article, [class*="content"], [class*="article"]');
      if (!isPartOfArticle) {
        this.logStatus('Element skipped: not part of main content', { element: el });
        return false;
      }

      if (el.closest('[role="navigation"], [role="menu"], button, a, input, select, textarea')) {
        this.logStatus('Element skipped: interactive element', { element: el });
        return false;
      }

      return true;
    });

    this.logStatus('Filtered elements:', { 
      count: filteredElements.length,
      types: filteredElements.map(el => ({
        type: this.getElementType(el),
        length: el.textContent?.trim().length,
        words: el.textContent?.trim().split(/\s+/).length,
        hasHeading: !!el.querySelector('h1, h2, h3, h4, h5, h6')
      }))
    });

    return filteredElements;
  }

  private shouldAnalyzeElement(el: HTMLElement): boolean {
    this.logStatus('Checking element:', {
      element: el,
      text: el.textContent?.trim().substring(0, 50) + '...',
      textLength: el.textContent?.trim().length,
      words: el.textContent?.trim().split(/\s+/).length
    });

    const text = el.textContent?.trim() || '';
    
    if (text.length < this.minParagraphLength) {
      this.logStatus('Text skipped: insufficient length', { 
        element: el, 
        length: text.length,
        minRequired: this.minParagraphLength
      });
      return false;
    }

    if (this.analyzedTexts.has(text)) {
      this.logStatus('Text skipped: duplicate', { element: el });
      return false;
    }

    this.logStatus('Element suitable for analysis', {
      element: el,
      type: this.getElementType(el),
      words: text.split(/\s+/).length,
      length: text.length
    });

    return true;
  }

  private async analyzeElement(el: HTMLElement): Promise<void> {
    if (this.processingElement === el || this.analysisQueue.has(el)) {
      return;
    }

    let textToAnalyze = '';
    if (el.tagName.toLowerCase() === 'li' && el.parentElement) {
      textToAnalyze = Array.from(el.parentElement.children)
        .map(item => item.textContent?.trim())
        .filter(Boolean)
        .join('\n• ');
    } else {
      textToAnalyze = el.textContent?.trim() || '';
    }

    if (!this.shouldAnalyzeElement(el) || !textToAnalyze) {
      this.logStatus('Element skipped:', {
        text: textToAnalyze.substring(0, 30) + '...',
        reason: 'Not suitable for analysis'
      });
      return;
    }

    this.analyzedTexts.add(textToAnalyze);
    this.analysisQueue.add(el);
    let loadingIndicator: HTMLElement | null = null;
    
    try {
      this.processingElement = el;
      
      const container = document.createElement('div');
      container.className = 'readability-result-container';
      el.parentElement?.insertBefore(container, el);
      container.appendChild(el);

      loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'readability-indicator readability-loading';
      loadingIndicator.innerHTML = 'Analyzing..>_<';
      container.appendChild(loadingIndicator);

      this.logStatus('Starting analysis:', { 
        type: this.getElementType(el),
        length: textToAnalyze.length,
        words: textToAnalyze.split(/\s+/).length
      });

      // Проверяем кэш перед запросом к API
      if (this.resultsCache.has(textToAnalyze)) {
        const cachedResult = this.resultsCache.get(textToAnalyze);
        if (cachedResult) {
          this.cacheHits++;
          this.logStatus('Cache used:', { 
            cacheHits: this.cacheHits,
            result: cachedResult
          });
          
          if (el.tagName.toLowerCase() === 'li' && el.parentElement) {
            Array.from(el.parentElement.children).forEach(item => {
              this.analysisResults.set(item as HTMLElement, cachedResult);
            });
          } else {
            this.analysisResults.set(el, cachedResult);
          }
          
          this.showAnalysisResult(container, cachedResult);
          this.analysisQueue.delete(el);
          if (this.processingElement === el) {
            this.processingElement = null;
          }
          return;
        }
      }

      try {
      const response = await axios.post<OpenAIResponse>(
        GPT_API_URL,
        {
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: AI_AGENTS_INSTRUCTIONS.readabilityAgent.instruction
          }, {
            role: "user",
            content: `Analyze the readability of the following text:\n\n${textToAnalyze}`
          }],
          temperature: 0.1,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.choices?.[0]?.message?.content) {
        try {
          const result = JSON.parse(response.data.choices[0].message.content);
          this.logStatus('Analysis result:', result);
            
            // Сохраняем результат в кэш
            this.resultsCache.set(textToAnalyze, result);
          
          if (el.tagName.toLowerCase() === 'li' && el.parentElement) {
            Array.from(el.parentElement.children).forEach(item => {
              this.analysisResults.set(item as HTMLElement, result);
            });
          } else {
            this.analysisResults.set(el, result);
          }
          
          this.showAnalysisResult(container, result);
        } catch (parseError) {
          this.logStatus('JSON parsing error:', parseError);
          if (loadingIndicator) {
            loadingIndicator.innerHTML = 'Analysis error ⚠️';
            loadingIndicator.className = 'readability-indicator readability-error';
              
              // Показываем детали ошибки
              this.showErrorDetails(container, 'Analysis error', {
                message: parseError instanceof Error ? parseError.message : 'Unknown error',
                response: response.data.choices?.[0]?.message?.content || 'No data'
              });
          }
        }
      }
    } catch (error) {
        const errorDetails = this.getErrorDetails(error);
        this.logStatus('Error during analysis:', errorDetails);
        
      if (loadingIndicator) {
        loadingIndicator.innerHTML = 'API request error ⚠️';
        loadingIndicator.className = 'readability-indicator readability-error';
          
          // Создаем контейнер для индикатора, если его нет
          const errorContainer = loadingIndicator.parentElement || document.createElement('div');
          
          // Показываем детали ошибки пользователю
          this.showErrorDetails(errorContainer, 'API request error', errorDetails);
        }
      }
    } catch (error) {
      this.logStatus('Critical error:', error);
      if (loadingIndicator) {
        loadingIndicator.innerHTML = 'Critical error ⚠️';
        loadingIndicator.className = 'readability-indicator readability-error';
        
        // Создаем контейнер для индикатора, если его нет
        const errorContainer = loadingIndicator.parentElement || document.createElement('div');
        
        // Показываем общую ошибку
        this.showErrorDetails(errorContainer, 'Critical error', {
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } finally {
      this.analysisQueue.delete(el);
      if (this.processingElement === el) {
        this.processingElement = null;
      }
    }
  }

  private showAnalysisResult(container: HTMLElement, result: { score: number; explanation: string; details: string[] }): void {
    container.querySelector('.readability-indicator')?.remove();

    const indicator = document.createElement('div');
    const bgColor = this.getScoreBackgroundColor(result.score);
    const borderColor = this.getScoreBorderColor(result.score);
    
    indicator.className = 'readability-indicator';
    indicator.style.background = '#121212';
    indicator.style.borderColor = borderColor;
    
    const element = container.firstElementChild as HTMLElement;
    const elementType = this.getElementType(element);
    const elementInfo = this.getElementInfo(element);
    
    // Специальная обработка для таблиц
    const isTable = elementType === 'Table';
    if (isTable) {
      container.style.position = 'relative';
      container.style.paddingRight = '4.5em';
      container.style.paddingLeft = '0';
    }
    
    // Создаем основной индикатор (только оценка)
    indicator.innerHTML = `
      <div class="readability-score" style="color: ${borderColor};">${result.score.toFixed(1)}</div>
      <div class="readability-tooltip">
        <div style="font-weight: 600; margin-bottom: 8px;">${result.explanation}</div>
        ${result.details && result.details.length > 0 ? `
          <div style="margin-top: 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">Complex Elements:</div>
            <ul style="padding-left: 16px;">
              ${result.details.map(detail => `<li style="margin-bottom: 4px;">${this.highlightComplexTerms(detail, borderColor)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
    
    // Добавляем обработчик клика для показа модального окна с полными деталями
    indicator.addEventListener('click', () => {
      this.showDetailsModal(result, elementType, elementInfo);
    });

    container.appendChild(indicator);
    
    if (element) {
      element.style.backgroundColor = this.getScoreBgColor(result.score);
      element.style.transition = 'background-color 0.3s ease';
    }
  }

  private getElementType(el: HTMLElement | null): string {
    if (!el) return 'Text';
    
    if (el.className === 'combined-paragraphs') {
      const hasHeading = !!el.querySelector('h1, h2, h3, h4, h5, h6');
      return hasHeading ? 'Section with heading' : 'Combined text';
    }
    
    if (el.className === 'table-wrapper' || 
        el.tagName.toLowerCase() === 'table' || 
        el.classList.toString().toLowerCase().includes('table')) {
      return 'Table';
    }
    
    if (el.className === 'list-wrapper' || 
        el.tagName.toLowerCase() === 'ul' || 
        el.tagName.toLowerCase() === 'ol') {
      return 'List';
    }
    
    const tag = el.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag)) return `Heading ${tag.charAt(1)}`;
    if (tag === 'li') return 'List item';
    return 'Paragraph';
  }

  private getElementInfo(el: HTMLElement | null): string {
    if (!el) return '';
    
    const text = el.textContent?.trim() || '';
    const words = text.split(/\s+/).length;
    return `${words} words`;
  }

  private getScoreBackgroundColor(score: number, alpha: number = 1): string {
    if (score <= 6) return `rgba(220, 252, 231, ${alpha})`; // Зеленый
    if (score <= 12) return `rgba(254, 249, 195, ${alpha})`; // Желтый
    return `rgba(254, 226, 226, ${alpha})`; // Красный
  }

  private getScoreBorderColor(score: number): string {
    if (score <= 6) return '#16a34a'; // Зеленый
    if (score <= 12) return '#ca8a04'; // Желтый
    return '#dc2626'; // Красный
  }

  private getScoreBgColor(score: number): string {
    if (score <= 6) return '#16a34a20'; // Зеленый с прозрачностью
    if (score <= 12) return '#ca8a0420'; // Желтый с прозрачностью
    return '#dc262620'; // Красный с прозрачностью
  }

  private highlightComplexTerms(text: string, color: string): string {
    // Улучшенное регулярное выражение для поиска терминов в различных стилях кавычек и форматах
    const quotedTermsRegex = /'([^']+)'|"([^"]+)"|«([^»]+)»|'([^']+)'|"([^"]+)"|`([^`]+)`/g;
    const quotedTerms = text.match(quotedTermsRegex);
    
    // Если нашли термины в кавычках, выделяем их
    if (quotedTerms && quotedTerms.length > 0) {
      let highlightedText = text;
      quotedTerms.forEach(term => {
        // Извлекаем слово без кавычек
        const cleanTerm = term.replace(/['"""«»'"`]/g, '');
        // Заменяем на выделенную версию, используя цвет оценки
        highlightedText = highlightedText.replace(
          term, 
          `<span style="color: ${color}; font-weight: 600;">${term}</span>`
        );
      });
      return highlightedText;
    }
    
    // Ищем числа (например, оценки читаемости)
    const numberRegex = /\b\d+(\.\d+)?\b/g;
    const numbers = text.match(numberRegex);
    if (numbers && numbers.length > 0) {
      let highlightedText = text;
      numbers.forEach(num => {
        highlightedText = highlightedText.replace(
          new RegExp(`\\b${num}\\b`, 'g'),
          `<span style="color: ${color}; font-weight: 600;">${num}</span>`
        );
      });
      return highlightedText;
    }
    
    // Ищем термины после определенных маркеров
    const markerPatterns = [
      /such as\s+([^,.;:]+)/i,
      /like\s+([^,.;:]+)/i, 
      /including\s+([^,.;:]+)/i,
      /:\s*([^,.;]+)/,
      /terms?\s+([^,.;:]+)/i,
      /words?\s+([^,.;:]+)/i,
      /phrases?\s+([^,.;:]+)/i,
      /sentences?\s+([^,.;:]+)/i
    ];
    
    for (const pattern of markerPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return text.replace(
          match[1],
          `<span style="color: ${color}; font-weight: 600;">${match[1]}</span>`
        );
      }
    }
    
    // Если все еще не нашли термины, ищем любые слова длиннее 8 символов
    const longWords = text.match(/\b\w{8,}\b/g);
    if (longWords && longWords.length > 0) {
      let highlightedText = text;
      longWords.forEach(word => {
        highlightedText = highlightedText.replace(
          new RegExp(`\\b${word}\\b`, 'g'),
          `<span style="color: ${color}; font-weight: 600;">${word}</span>`
        );
      });
      return highlightedText;
    }
    
    // Если все методы не сработали, возвращаем исходный текст
    return text;
  }

  private getShortExplanation(score: number): string {
    if (score <= 6) return 'Simple text';
    if (score <= 9) return 'Average text';
    if (score <= 12) return 'Complex text';
    return 'Very complex';
  }

  private getDetailedExplanation(score: number): string {
    if (score <= 6) {
      return 'Text is easy to read and understand for a wide audience. Suitable for general use.';
    }
    if (score <= 9) {
      return 'Text of moderate complexity. Requires basic education for full understanding.';
    }
    if (score <= 12) {
      return 'Text of increased complexity. May be difficult for some audience.';
    }
    return 'Text of high complexity. Requires special knowledge or preparation.';
  }

  private showDetailsModal(
    result: { score: number; explanation: string; details: string[] },
    elementType: string,
    elementInfo: string
  ): void {
    // Проверяем, что document существует (для SSR)
    if (typeof document === 'undefined') return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
    
    // Извлекаем сложные слова и предложения из деталей
    const complexWords: string[] = [];
    const complexSentences: string[] = [];
    
    result.details.forEach(detail => {
      if (detail.toLowerCase().includes('word') || detail.toLowerCase().includes('term')) {
        complexWords.push(detail);
      } else if (detail.toLowerCase().includes('sentence') || detail.toLowerCase().includes('phrase')) {
        complexSentences.push(detail);
      }
    });
    
    // Остальные детали
    const otherDetails = result.details.filter(detail => 
      !complexWords.includes(detail) && !complexSentences.includes(detail));
    
    const scoreColor = this.getScoreBorderColor(result.score);
    
    modal.innerHTML = `
      <div class="bg-black text-white rounded-xl shadow-xl max-w-md w-full mx-4 p-4 border border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-white">${elementType}</h3>
          <div class="text-2xl font-bold px-3 py-1 rounded-lg" style="color: ${scoreColor}; background: ${scoreColor}20; border: 2px solid ${scoreColor}40;">
            ${result.score.toFixed(1)}
          </div>
        </div>
        
        <p class="text-sm text-gray-400 mb-2">${elementInfo}</p>
        <p class="text-gray-300 mb-4 font-medium">${result.explanation}</p>
        
        ${complexWords.length > 0 ? `
          <div class="mb-3">
            <h4 class="font-bold text-sm mb-2" style="color: ${scoreColor}">Complex Words and Terms:</h4>
            <div class="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <ul class="list-disc pl-5 space-y-1">
                ${complexWords.map(word => `<li class="text-sm">${this.highlightComplexTerms(word, scoreColor)}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
        
        ${complexSentences.length > 0 ? `
          <div class="mb-3">
            <h4 class="font-bold text-sm mb-2" style="color: ${scoreColor}">Complex Sentences:</h4>
            <div class="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <ul class="list-disc pl-5 space-y-1">
                ${complexSentences.map(sentence => `<li class="text-sm">${this.highlightComplexTerms(sentence, scoreColor)}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
        
        ${otherDetails.length > 0 ? `
          <div class="mb-3">
            <h4 class="font-bold text-sm mb-2 text-gray-400">Additional Information:</h4>
            <div class="bg-gray-900 p-3 rounded-lg border border-gray-700">
              <ul class="list-disc pl-5 space-y-1">
                ${otherDetails.map(detail => `<li class="text-sm text-gray-300">${this.highlightComplexTerms(detail, scoreColor)}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
        
        <button class="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 mt-2 border border-gray-700">Close</button>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('button')?.addEventListener('click', () => modal.remove());
    
    // Добавляем закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  showTotalScore(): void {
    // Проверяем, что document существует (для SSR)
    if (typeof document === 'undefined') return;
    
    if (this.analysisResults.size === 0) return;

    // Проверяем, что все элементы проанализированы
    if (this.analysisQueue.size > 0) {
      this.logStatus('Deferred showing total result: not all elements analyzed', {
        queueSize: this.analysisQueue.size,
        resultsSize: this.analysisResults.size
      });
      // Пробуем показать результат через небольшую задержку
      setTimeout(() => this.showTotalScore(), 1000);
      return;
    }

    const results = Array.from(this.analysisResults.entries());
    const validResults = results.filter(([el, r]) => r.score >= 1);
    
    if (validResults.length === 0) return;

    // Улучшенные веса для разных типов контента
    const weights = {
      'Section with heading': 2.5,
      'Table': 2.0,
      'List': 1.5,
      'Paragraph': 1.0,
      'Combined text': 1.2
    };

    // Группируем результаты по типам
    const byType = validResults.reduce((acc, [el, r]) => {
      const type = this.getElementType(el);
      if (!acc[type]) {
        acc[type] = {
          scores: [],
          totalWords: 0,
          elements: []
        };
      }
      const words = el.textContent?.trim().split(/\s+/).length || 0;
      acc[type].scores.push(r.score);
      acc[type].totalWords += words;
      acc[type].elements.push(el);
      return acc;
    }, {} as Record<string, { scores: number[], totalWords: number, elements: HTMLElement[] }>);

    // Вычисляем общий балл
    let totalWeight = 0;
    let weightedSum = 0;
    let totalWords = 0;

    Object.entries(byType).forEach(([type, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      const weight = weights[type as keyof typeof weights] || 1;
      // Изменяем расчет весов для более точного отражения важности каждого типа контента
      // Увеличиваем влияние количества слов на вес
      const wordWeight = Math.log10(data.totalWords + 1);
      
      // Учитываем количество элементов каждого типа
      const typeWeight = weight * wordWeight;
      
      weightedSum += avgScore * typeWeight;
      totalWeight += typeWeight;
      totalWords += data.totalWords;
      
      this.logStatus(`Content type: ${type}`, {
        avgScore,
        weight,
        wordWeight,
        typeWeight,
        elements: data.elements.length,
        words: data.totalWords
      });
    });

    // Округляем до одного десятичного знака, но без использования Math.round
    // для более точного представления результата
    this.totalScore = parseFloat((weightedSum / totalWeight).toFixed(1));
    
    this.logStatus('Final total score calculation:', {
      weightedSum,
      totalWeight,
      totalScore: this.totalScore,
      totalWords
    });

    // Создаем модальное окно с улучшенным дизайном
    const modal = document.createElement('div');
    modal.className = 'fixed top-4 right-4 rounded-xl shadow-xl p-6 z-50 total-score-modal';
    modal.style.cssText = `
      max-width: 400px;
      border: 2px solid ${this.getScoreBorderColor(this.totalScore)};
      background: #121212;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    // Формируем статистику по типам
    const typeStats = Object.entries(byType).map(([type, data]) => {
      const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      const weight = weights[type as keyof typeof weights] || 1;
      const percentage = (data.totalWords / totalWords * 100).toFixed(1);
      const scoreColor = this.getScoreBorderColor(avg);
      
      return `
        <div class="mb-4 p-3 rounded-lg" style="
          background: rgba(30, 30, 30, 0.9);
          border: 2px solid ${scoreColor}40;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        ">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold" style="color: #ffffff; font-size: 14px;">${type}</span>
            <span class="text-lg font-bold" style="color: ${scoreColor}">${avg.toFixed(1)}</span>
          </div>
          <div style="
            color: #cccccc;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <span style="
              background: ${scoreColor}20;
              padding: 2px 8px;
              border-radius: 4px;
              border: 1px solid ${scoreColor}40;
              color: ${scoreColor};
            ">Weight: ${weight}x</span>
            <span>${data.scores.length} elements</span>
            <span>${data.totalWords} words (${percentage}%)</span>
          </div>
          <div class="h-2 rounded-full overflow-hidden" style="
            background: #333333;
            border: 1px solid ${scoreColor}40;
          ">
            <div class="h-full rounded-full transition-all duration-500" 
                 style="width: ${percentage}%; background: ${scoreColor}"></div>
          </div>
        </div>`;
    }).join('');

    const getReadabilityStatus = (score: number): string => {
      if (score <= 6) return '🟢 Excellent Readability';
      if (score <= 9) return '🟡 Good Readability';
      if (score <= 12) return '🟠 Needs Attention';
      return '🔴 Complex Text';
    };

    modal.innerHTML = `
      <div style="
        position: absolute;
        top: -10px;
        right: -10px;
        background: ${this.getScoreBorderColor(this.totalScore)};
        color: white;
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      ">${getReadabilityStatus(this.totalScore)}</div>
      
      <h3 style="
        color: #ffffff;
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 24px;
        text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
      ">Readability Analysis</h3>
      
      <div class="flex items-center justify-center mb-6">
        <div class="text-center">
          <p style="
            font-size: 48px;
            font-weight: 800;
            color: ${this.getScoreBorderColor(this.totalScore)};
            text-shadow: 2px 2px 4px ${this.getScoreBorderColor(this.totalScore)}20;
            margin-bottom: 8px;
          ">${this.totalScore}</p>
          <p style="
            color: #cccccc;
            font-size: 14px;
            font-weight: 500;
          ">Overall Score</p>
        </div>
      </div>

      <div class="mb-6">
        <div style="
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
        ">Content Distribution:</div>
        ${typeStats}
      </div>

      <div style="
        padding: 16px;
        border-radius: 8px;
        background: rgba(30, 30, 30, 0.9);
        border: 2px solid ${this.getScoreBorderColor(this.totalScore)}40;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      ">
        <p style="
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
          line-height: 1.5;
        ">${this.getDetailedExplanation(this.totalScore)}</p>
        <p style="
          color: #aaaaaa;
          font-size: 12px;
          font-weight: 500;
        ">Analyzed: ${validResults.length} elements, ${totalWords} words</p>
      </div>
    `;

    document.body.appendChild(modal);
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    if (!this.isActive) return { isValid: false };
    
    this.analyzeElement(el);
    this.addedElements.add(el);

    return { isValid: true };
  }

  cleanup(): void {
    // Проверяем, что document существует (для SSR)
    if (typeof document === 'undefined') return;
    
    this.logStatus('Cleaning up readability analysis tool');
    this.isActive = false;
    this.analysisQueue.clear();
    this.processingElement = null;
    this.analyzedTexts.clear();
    
    // Выводим статистику использования кэша
    if (this.cacheHits > 0) {
      this.logStatus('Cache statistics:', {
        hits: this.cacheHits,
        cacheSize: this.resultsCache.size,
        hitRate: `${((this.cacheHits / (this.analysisResults.size || 1)) * 100).toFixed(1)}%`
      });
    }
    
    document.querySelectorAll('.readability-result-container').forEach(container => {
      const content = container.querySelector('p, h1, h2, h3, h4, h5, h6, li') as HTMLElement;
      if (content) {
        content.style.backgroundColor = '';
        content.style.transition = '';
        container.parentElement?.insertBefore(content, container);
      }
      container.remove();
    });
    
    this.analysisResults.clear();
    this.totalScore = null;
    this.addedElements.clear();
    
    document.querySelector('.total-score-modal')?.remove();
  }

  run(action: 'apply' | 'cleanup'): { success: boolean } {
    // Check that document exists (for SSR)
    if (typeof document === 'undefined') return { success: false };
    
    if (action === 'cleanup') {
      this.cleanup();
      return { success: true };
    }

    if (this.isActive) {
      return { success: false };
    }

    this.logStatus('Starting readability analysis');
    this.isActive = true;
    
    const elements = this.getContentElements();
    this.logStatus(`Elements found: ${elements.length}`);
    
    // If there are no elements to analyze
    if (elements.length === 0) {
      this.logStatus('No elements to analyze');
      this.isActive = false;
      return { success: false };
    }
    
    // Создаем индикатор прогресса
    const progressContainer = document.createElement('div');
    progressContainer.className = 'fixed bottom-4 right-4 bg-zinc-900 rounded-xl shadow-2xl p-4 z-50 border border-amber-500/30';
    progressContainer.style.cssText = `
      min-width: 250px;
      backdrop-filter: blur(8px);
      font-family: system-ui, -apple-system, sans-serif;
      animation: fadeIn 0.5s ease-out;
    `;
    
    // Добавляем стили для анимаций
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes pulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(styleElement);
    
    document.body.appendChild(progressContainer);
    
    // Параллельный анализ с ограничением запросов
    const CONCURRENT_REQUESTS = 3; // Увеличиваем количество параллельных запросов
    let completedAnalyses = 0;
    let failedAnalyses = 0;
    let totalElements = elements.length;
    let isAnalysisComplete = false;
    let activeRequests = 0; // Счетчик активных запросов
    let lastProgressUpdate = Date.now();
    
    const updateProgress = (progress: number) => {
      if (!this.isActive) return;
      
      const now = Date.now();
      // Обновляем UI не чаще чем раз в 100 мс для производительности
      if (now - lastProgressUpdate < 100 && progress < 100) return;
      lastProgressUpdate = now;
      
      progressContainer.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-amber-500">Readability Analysis</span>
          <span class="text-sm font-bold text-amber-400">${progress}%</span>
        </div>
        <div class="relative h-2 rounded-full overflow-hidden bg-zinc-800 mb-3">
          <div class="h-full rounded-full transition-all duration-300" 
               style="width: ${progress}%; background: linear-gradient(90deg, #f59e0b, #f97316, #fbbf24); background-size: 200% 200%; animation: gradient 2s ease infinite;"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-xs text-zinc-400">
            Processed ${completedAnalyses} of ${totalElements}
            ${failedAnalyses > 0 ? `<span class="text-red-500">(${failedAnalyses} errors)</span>` : ''}
          </div>
          <div class="ml-2 w-5 h-5 rounded-full" 
               style="background: conic-gradient(from 0deg, #f59e0b, #f97316, #fbbf24, #f59e0b); animation: spin 1.5s linear infinite;">
          </div>
        </div>
        <div class="text-xs text-amber-500/80 mt-1 flex items-center">
          <div class="w-2 h-2 rounded-full bg-amber-500 mr-1" style="animation: pulse 1.5s infinite;"></div>
          Active requests: ${activeRequests}
        </div>
      `;
    };

    // Создаем очередь элементов для анализа
    const queue = [...elements];
    
    // Добавляем таймер для проверки зависших запросов
    let completionTimer: number | null = null;
    
    // Function to check for stuck requests
    const checkStuckRequests = () => {
      if (!this.isActive || isAnalysisComplete) return;
      
      this.logStatus('Checking for stuck requests', {
        activeRequests,
        queueLength: queue.length,
        completed: completedAnalyses,
        failed: failedAnalyses,
        total: totalElements
      });
      
      // If there are active requests but progress is not changing for a long time
      if (activeRequests > 0 && queue.length === 0 && 
          completedAnalyses + failedAnalyses + activeRequests >= totalElements) {
        this.logStatus('Stuck requests detected, forcing completion', {
          activeRequests
        });
        
        // Force consider the analysis complete
        checkCompletion(true);
      } else if (queue.length === 0 && activeRequests === 0 && 
                completedAnalyses + failedAnalyses < totalElements) {
        // If the queue is empty, no active requests, but not all elements are processed
        this.logStatus('Element count mismatch detected, forcing completion', {
          processed: completedAnalyses + failedAnalyses,
          total: totalElements
        });
        
        // Force consider the analysis complete
        checkCompletion(true);
      }
      
      // Continue checking every 5 seconds
      if (!isAnalysisComplete) {
        completionTimer = window.setTimeout(checkStuckRequests, 5000);
      }
    };
    
    // Start timer for checking
    completionTimer = window.setTimeout(checkStuckRequests, 5000);
    
    const checkCompletion = (force: boolean = false) => {
      if ((completedAnalyses + failedAnalyses >= totalElements && activeRequests === 0) || 
          force === true) {
        if (isAnalysisComplete) return; // Prevent repeated execution
        
        isAnalysisComplete = true;
        
        // Clear the timer for checking stuck requests
        if (completionTimer) {
          clearTimeout(completionTimer);
          completionTimer = null;
        }
        
        this.logStatus('All analyses completed', {
          completed: completedAnalyses,
          failed: failedAnalyses,
          total: totalElements,
          forced: force
        });
        
        if (this.isActive) {
          // Show completion animation
          progressContainer.innerHTML = `
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-green-500">Analysis Complete</span>
              <span class="text-sm font-bold text-green-400">100%</span>
            </div>
            <div class="relative h-2 rounded-full overflow-hidden bg-zinc-800 mb-3">
              <div class="h-full rounded-full transition-all duration-300 bg-green-500" 
                   style="width: 100%;"></div>
            </div>
            <div class="text-xs text-green-400 text-center">
              Processed ${completedAnalyses} elements
              ${failedAnalyses > 0 ? `<span class="text-red-500">(${failedAnalyses} errors)</span>` : ''}
            </div>
          `;
          
          // Add fade out animation
          setTimeout(() => {
            progressContainer.style.animation = 'fadeOut 0.5s ease-in forwards';
            // Add style for fade out animation
            styleElement.textContent += `
              @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(10px); }
              }
            `;
            
          setTimeout(() => {
            progressContainer.remove();
              styleElement.remove();
            if (this.isActive && completedAnalyses > 0) {
                // Add additional delay before showing the final result
                // to ensure that all DOM operations are completed
                setTimeout(() => {
              this.showTotalScore();
              this.logStatus('Total result displayed');
                }, 300);
            }
            }, 500);
          }, 1000);
        }
      }
    };

    // Function for processing one element from the queue
    const processNextElement = async () => {
      if (!this.isActive || isAnalysisComplete) {
        return;
      }

      const el = queue.shift();
      if (!el) {
        // Queue empty, check completion
        if (activeRequests === 0)
        checkCompletion();
        return;
      }

      activeRequests++;
      updateProgress(Math.round(((completedAnalyses + failedAnalyses) / totalElements) * 100));
      
        try {
          await this.validateElement(el);
          completedAnalyses++;
        } catch (error) {
          this.logStatus('Error analyzing element:', { element: el, error });
          failedAnalyses++;
      } finally {
        activeRequests--;
        
        // Update progress
        const progress = Math.round(((completedAnalyses + failedAnalyses) / totalElements) * 100);
        updateProgress(progress);
        
        // Process next element from the queue
        if (queue.length > 0 && !isAnalysisComplete) {
          processNextElement();
        }
        
        // Check completion only if no active requests and queue empty
        if (queue.length === 0 && activeRequests === 0) {
          checkCompletion();
        }
      }
    };
    
    // Start initial parallel requests
    for (let i = 0; i < Math.min(CONCURRENT_REQUESTS, elements.length); i++) {
      processNextElement();
    }

    return { success: true };
  }

  // New method for getting error details
  private getErrorDetails(error: any): any {
    const details: any = {
      message: 'Unknown error'
    };
    
    if (error instanceof Error) {
      details.message = error.message;
      details.name = error.name;
      details.stack = error.stack;
    }
    
    if (axios.isAxiosError(error)) {
      details.status = error.response?.status;
      details.statusText = error.response?.statusText;
      details.url = error.config?.url;
      details.method = error.config?.method;
      
      if (error.response?.data) {
        details.responseData = error.response.data;
      }
      
      // Specific OpenAI API errors
      if (error.response?.status === 401) {
        details.userMessage = 'Authorization error. Check your API key.';
      } else if (error.response?.status === 429) {
        details.userMessage = 'API request limit exceeded.';
      } else if (error.response?.status === 500) {
        details.userMessage = 'OpenAI server error.';
      } else {
        details.userMessage = `API error: ${error.response?.status || 'unknown'}`;
      }
    }
    
    return details;
  }
  
  // New method for displaying error details
  private showErrorDetails(container: HTMLElement, title: string, details: any): void {
    const indicator = container.querySelector('.readability-indicator');
    
    indicator?.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-4">
          <h3 class="text-lg font-bold mb-2 text-red-600">${title}</h3>
          <p class="text-sm text-gray-700 mb-3">${details.userMessage || details.message}</p>
          
          ${details.status ? `
          <div class="bg-gray-100 p-2 rounded mb-3">
            <p class="text-sm font-medium">Status: ${details.status} ${details.statusText || ''}</p>
            ${details.url ? `<p class="text-xs text-gray-500">URL: ${details.url}</p>` : ''}
          </div>
          ` : ''}
          
          ${details.responseData ? `
          <div class="mb-3">
            <p class="text-sm font-medium mb-1">Server Response:</p>
            <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">${
              typeof details.responseData === 'object' 
                ? JSON.stringify(details.responseData, null, 2) 
                : details.responseData
            }</pre>
          </div>
          ` : ''}
          
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.querySelector('button')?.addEventListener('click', () => modal.remove());
    });
  }
}

const readabilityTool = new ReadabilityTool();

export function checkReadability(action: 'apply' | 'cleanup'): { success: boolean } {
  if (action === 'cleanup') {
    readabilityTool.cleanup();
    return { success: true };
  }

  const result = readabilityTool.run(action);
  return { success: result?.success ?? true };
}

function showReadabilityModal(analysis: string) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">Text Readability Analysis</h3>
      <div class="prose max-w-none">
        ${analysis}
      </div>
      <div class="mt-6 flex justify-end">
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('button')?.addEventListener('click', () => modal.remove());
} 