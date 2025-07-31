# Blue Expo（ブルーエキスポ）イベントHP デザイン設計書

## 概要

茨城県商工会主催の地域貢献イベント「Blue Expo（ブルーエキスポ）」の公式ウェブサイトのデザイン設計書です。長岡花火大会サイトをデザイン参考とし、青をメインカラーとしたモダンで親しみやすいデザインを採用します。レスポンシブデザインによりスマートフォン・タブレット・デスクトップ全てのデバイスで最適な表示を実現し、地域住民と来場者にとって使いやすいサイトを構築します。

## アーキテクチャ

### 技術スタック
- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **CSSフレームワーク**: Bootstrap 5.3 (レスポンシブ対応)
- **JavaScriptライブラリ**: 
  - jQuery 3.7 (DOM操作とアニメーション)
  - AOS (Animate On Scroll) (スクロールアニメーション)
- **アイコン**: Font Awesome 6.4
- **フォント**: Google Fonts (Noto Sans JP, Roboto)
- **バックエンド**: PHP 8.1 (お問い合わせフォーム、CMS機能)
- **データベース**: MySQL 8.0 (コンテンツ管理)
- **サーバー**: Apache 2.4 (レンタルサーバー対応)

### サイト構造
```
/
├── index.html (トップページ)
├── about/ (イベント詳細)
├── access/ (アクセス・会場案内)
├── program/ (プログラム・タイムスケジュール)
├── exhibitors/ (出店者・参加企業)
├── volunteer/ (ボランティア募集)
├── contact/ (お問い合わせ)
├── gallery/ (過去の写真)
├── sponsors/ (スポンサー・協賛企業)
├── admin/ (管理画面)
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
└── api/ (フォーム送信、CMS API)
```

## コンポーネントとインターフェース

### 1. ヘッダーコンポーネント
**デザイン仕様:**
- 固定ヘッダー（スクロール時も表示維持）
- ロゴ: 「Blue Expo」ロゴ（左上配置）
- ナビゲーションメニュー（右側配置）
- ハンバーガーメニュー（モバイル対応）
- 背景色: 濃紺（#1e3a8a）、透明度80%

**ナビゲーション項目:**
- ホーム / イベント詳細 / プログラム / アクセス / 出店者 / ボランティア / お問い合わせ

### 2. ヒーローセクション
**デザイン仕様:**
- フルスクリーン背景画像（茨城県筑西市の風景またはイベントイメージ）
- グラデーションオーバーレイ（青系グラデーション）
- 中央配置のメインコンテンツ:
  - イベントロゴ（大サイズ）
  - 開催日時（決定後に表示）
  - 開催場所「茨城県筑西市」
  - CTAボタン「詳細を見る」

### 3. イベント概要セクション
**デザイン仕様:**
- 3カラムレイアウト（モバイルでは1カラム）
- アイコン付きの特徴紹介
- アニメーション効果（スクロール時にフェードイン）

### 4. お知らせ・ニュースセクション
**デザイン仕様:**
- カード形式のレイアウト
- 日付、タイトル、概要の表示
- 「もっと見る」ボタン

### 5. アクセス情報セクション
**デザイン仕様:**
- Google Maps埋め込み
- 交通手段別のアクセス方法
- 駐車場情報

### 6. フッターコンポーネント
**デザイン仕様:**
- 背景色: 濃紺（#1e3a8a）
- 3カラムレイアウト:
  - イベント情報
  - リンク集
  - SNS・お問い合わせ
- コピーライト表示

## データモデル

### 1. イベント情報 (events)
```sql
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME,
    location VARCHAR(255),
    status ENUM('planning', 'confirmed', 'cancelled') DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. ニュース・お知らせ (news)
```sql
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    publish_date DATETIME,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. 出店者・参加企業 (exhibitors)
```sql
CREATE TABLE exhibitors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. スポンサー企業 (sponsors)
```sql
CREATE TABLE sponsors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    sponsor_level ENUM('platinum', 'gold', 'silver', 'bronze') DEFAULT 'bronze',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. お問い合わせ (contacts)
```sql
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'replied', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. ボランティア応募 (volunteers)
```sql
CREATE TABLE volunteers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    age_group VARCHAR(20),
    experience TEXT,
    availability TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## エラーハンドリング

### 1. フロントエンドエラーハンドリング
- **フォーム検証エラー**: リアルタイム検証とエラーメッセージ表示
- **画像読み込みエラー**: デフォルト画像への自動切り替え
- **JavaScript エラー**: コンソールログ記録とグレースフルデグラデーション
- **ネットワークエラー**: ユーザーフレンドリーなエラーメッセージ表示

### 2. バックエンドエラーハンドリング
- **データベース接続エラー**: メンテナンス画面表示
- **ファイルアップロードエラー**: サイズ・形式チェックとエラー通知
- **フォーム送信エラー**: 詳細なエラーメッセージとリトライ機能
- **認証エラー**: 管理画面へのアクセス制御

### 3. エラーログ機能
```php
// エラーログ記録関数
function logError($message, $context = []) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'message' => $message,
        'context' => $context,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    file_put_contents('logs/error.log', json_encode($logEntry) . "\n", FILE_APPEND);
}
```

## テスト戦略

### 1. ユニットテスト
- **JavaScript関数テスト**: Jest使用
- **PHP関数テスト**: PHPUnit使用
- **CSS レグレッションテスト**: BackstopJS使用

### 2. 統合テスト
- **フォーム送信テスト**: 各フォームの正常動作確認
- **データベース連携テスト**: CRUD操作の動作確認
- **API エンドポイントテスト**: レスポンス形式と状態コード確認

### 3. ユーザビリティテスト
- **レスポンシブデザインテスト**: 
  - デスクトップ: 1920x1080, 1366x768
  - タブレット: 768x1024, 1024x768
  - スマートフォン: 375x667, 414x896
- **ブラウザ互換性テスト**: Chrome, Firefox, Safari, Edge
- **アクセシビリティテスト**: WCAG 2.1 AA準拠確認

### 4. パフォーマンステスト
- **ページ読み込み速度**: 3秒以内の目標
- **画像最適化**: WebP形式対応、遅延読み込み実装
- **CSS/JS最適化**: ミニファイ化とGzip圧縮

### 5. セキュリティテスト
- **SQLインジェクション対策**: プリペアドステートメント使用
- **XSS対策**: 入力値のサニタイズ実装
- **CSRF対策**: トークン検証実装
- **ファイルアップロード制限**: 拡張子・サイズ制限実装

## デザインシステム

### カラーパレット
- **プライマリ**: #1e3a8a (濃紺)
- **セカンダリ**: #3b82f6 (青)
- **アクセント**: #60a5fa (明るい青)
- **背景**: #f8fafc (薄いグレー)
- **テキスト**: #1f2937 (ダークグレー)
- **成功**: #10b981 (緑)
- **警告**: #f59e0b (オレンジ)
- **エラー**: #ef4444 (赤)

### タイポグラフィ
- **見出し1**: Noto Sans JP, 32px, Bold
- **見出し2**: Noto Sans JP, 24px, Bold  
- **見出し3**: Noto Sans JP, 20px, Medium
- **本文**: Noto Sans JP, 16px, Regular
- **キャプション**: Noto Sans JP, 14px, Regular

### スペーシング
- **セクション間**: 80px (デスクトップ), 40px (モバイル)
- **要素間**: 24px (デスクトップ), 16px (モバイル)
- **コンテナ幅**: 最大1200px, 左右余白24px

### アニメーション
- **フェードイン**: 0.6秒のイージング
- **ホバーエフェクト**: 0.3秒のトランジション
- **スクロールアニメーション**: AOS ライブラリ使用

この設計書に基づいて、地域住民と来場者にとって使いやすく、視覚的に魅力的なBlue Expoのイベントサイトを構築します。