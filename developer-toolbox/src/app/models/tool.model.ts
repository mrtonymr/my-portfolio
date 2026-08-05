export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  keywords: string[];
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'json',
    name: 'JSON Formatter',
    description: 'Beautify, minify, validate and explore JSON with a tree view.',
    route: '/json',
    icon: 'data_object',
    keywords: ['json', 'format', 'beautify', 'minify', 'validate', 'pretty'],
  },
  {
    id: 'base64',
    name: 'Base64 Tool',
    description: 'Encode and decode Base64 with live UTF-8 conversion.',
    route: '/base64',
    icon: 'code',
    keywords: ['base64', 'encode', 'decode', 'utf8'],
  },
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description: 'Decode JWT headers and payloads locally in your browser.',
    route: '/jwt',
    icon: 'vpn_key',
    keywords: ['jwt', 'token', 'decode', 'auth', 'payload'],
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate UUID v4 values in batches and export them.',
    route: '/uuid',
    icon: 'fingerprint',
    keywords: ['uuid', 'guid', 'generate', 'v4', 'unique'],
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps, ISO and readable dates.',
    route: '/timestamp',
    icon: 'schedule',
    keywords: ['timestamp', 'unix', 'date', 'iso', 'epoch', 'time'],
  },
  {
    id: 'url',
    name: 'URL Encoder',
    description: 'Encode and decode URL components with live conversion.',
    route: '/url',
    icon: 'link',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent'],
  },
  {
    id: 'color',
    name: 'Color Picker',
    description: 'Pick colors and convert between Hex, RGB, HSL and HSV.',
    route: '/color',
    icon: 'palette',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'hsv', 'picker'],
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    description: 'Test regular expressions with live match highlighting.',
    route: '/regex',
    icon: 'find_in_page',
    keywords: ['regex', 'regexp', 'pattern', 'match', 'test'],
  },
  {
    id: 'regex-ai',
    name: 'Regex AI',
    description: 'Generate regular expressions from natural language with Groq.',
    route: '/regex-ai',
    icon: 'auto_awesome',
    keywords: ['regex', 'ai', 'groq', 'generate', 'llm'],
  },
];
