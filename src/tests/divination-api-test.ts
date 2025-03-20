const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function testDivinationAPI() {
  try {
    const testInput = `問題：本日運勢

輸入卜卦數字
下卦：639 / 上卦：872 / 變爻：357

本卦：謙卦
☷（上卦：坤）
☶（下卦：艮）
屬性：地/山
顏色：黃色/褐色
角色：支持者、保護者/穩定者、守護者
本卦含義：謙遜自守，象徵謙虛和柔和

變卦
變爻：第 3 爻
變卦：坤卦
☷（上卦：坤）
☷（下卦：坤）
屬性：地/地
顏色：黃色/黃色
角色：支持者、保護者/支持者、保護者
變卦含義：柔順、包容，象徵接納、穩重與支援

採用梅花易數的方式進行，請給我總結和建議`;

    console.log("\n易經占卜 API 測試");
    console.log("=================");
    console.log("發送請求中...\n");

    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ information: testInput }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '請求失敗');
    }

    console.log("API 回應：");
    console.log("-----------------");
    console.log(data.response);
    console.log("-----------------\n");
    console.log("✅ 測試完成！\n");

    return data.response;
  } catch (error) {
    console.error("\n❌ 測試失敗：", error);
    throw error;
  }
}

// Run the test if this file is being executed directly
if (require.main === module) {
  testDivinationAPI().catch(() => process.exit(1));
}

module.exports = testDivinationAPI; 