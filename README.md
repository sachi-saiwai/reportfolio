# reportfolio

静的HTML/CSS/JavaScriptで構成したポートフォリオです。

## ルーティング

`/works/kashika` からKASHIKAの詳細を表示できます。Worksのカード、戻るボタン、ブラウザの戻る・進むがURLと連動します。他の作品は従来の外部リンクです。

`index.html` を変更したら `node tools/build-routes.mjs` を実行して各URL用のHTMLを更新してください。各ルートの `index.html` も公開することで、静的ホスティングでの直接アクセス・再読み込みに対応します。サーバーによって末尾の `/` が追加されます。

画面画像は `assets/kashika.jpg` です。
