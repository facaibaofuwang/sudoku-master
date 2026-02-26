#!/usr/bin/env python3
"""
生成 Google Play 特色图片 (1024x500)
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_feature_graphic(output_path):
    """创建 1024x500 特色图片"""
    
    width, height = 1024, 500
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # 背景渐变
    for y in range(height):
        ratio = y / height
        r = int(79 + (37-79) * ratio)
        g = int(70 + (99-70) * ratio)
        b = int(229 + (235-229) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # 装饰圆形
    for i in range(5):
        x = 100 + i * 200
        y = 100 + (i % 2) * 300
        radius = 50 + i * 20
        draw.ellipse([x-radius, y-radius, x+radius, y+radius],
                    fill=(255, 255, 255, 30))
    
    # 右侧网格装饰
    grid_size = 200
    grid_left = width - 250
    grid_top = (height - grid_size) // 2
    
    # 网格背景
    draw.rectangle([grid_left, grid_top, grid_left+grid_size, grid_top+grid_size],
                   fill=(255, 255, 255, 230), outline=(79, 70, 229), width=3)
    
    cell_size = grid_size // 3
    for i in range(1, 3):
        x = grid_left + i * cell_size
        y = grid_top + i * cell_size
        draw.line([(x, grid_top), (x, grid_top+grid_size)], fill=(79, 70, 229), width=2)
        draw.line([(grid_left, y), (grid_left+grid_size, y)], fill=(79, 70, 229), width=2)
    
    # 标题
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    # 主标题
    title = "Sudoku Master"
    draw.text((80, 180), title, fill=(255, 255, 255), font=title_font)
    
    # 副标题
    subtitle = "经典数独益智游戏"
    draw.text((80, 280), subtitle, fill=(255, 255, 255, 200), font=subtitle_font)
    
    # 特性标签
    features = ["✓ 多种难度", "✓ 每日挑战", "✓ 成就系统"]
    y_offset = 350
    for feature in features:
        draw.text((80, y_offset), feature, fill=(255, 255, 255, 180), font=subtitle_font)
        y_offset += 50
    
    img.save(output_path, 'PNG')
    print(f"✓ 生成特色图片: {output_path}")

def create_screenshots():
    """创建应用截图模板"""
    
    screenshot_configs = [
        ("screenshot_home.png", "首页", ["选择难度", "每日挑战", "查看统计"]),
        ("screenshot_game.png", "游戏界面", ["9x9 数独棋盘", "笔记模式", "智能提示"]),
        ("screenshot_complete.png", "完成界面", ["用时统计", "最佳纪录", "新游戏"]),
    ]
    
    for filename, title, features in screenshot_configs:
        # 手机尺寸 1080x1920
        width, height = 1080, 1920
        img = Image.new('RGB', (width, height), (245, 240, 230))
        draw = ImageDraw.Draw(img)
        
        # 状态栏
        draw.rectangle([0, 0, width, 80], fill=(79, 70, 229))
        
        # 内容区域背景
        draw.rounded_rectangle([40, 120, width-40, height-200], fill=(255, 255, 255), radius=20)
        
        # 标题
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
            text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
        except:
            title_font = ImageFont.load_default()
            text_font = ImageFont.load_default()
        
        draw.text((width//2, 200), title, fill=(79, 70, 229), font=title_font, anchor="mm")
        
        # 特性列表
        y = 400
        for feature in features:
            draw.text((100, y), f"• {feature}", fill=(31, 41, 55), font=text_font)
            y += 100
        
        # 底部提示
        draw.text((width//2, height-100), "数独大师 - Sudoku Master", 
                 fill=(107, 114, 128), font=text_font, anchor="mm")
        
        output_path = os.path.join(os.path.dirname(__file__), '..', filename)
        img.save(output_path, 'PNG')
        print(f"✓ 生成截图模板: {filename}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 生成特色图片
    feature_path = os.path.join(base_dir, '..', 'feature_graphic.png')
    create_feature_graphic(feature_path)
    
    # 生成截图模板
    create_screenshots()
    
    print("\n✅ 所有推广素材生成完成!")

if __name__ == '__main__':
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("请先安装 Pillow: pip install Pillow")
        exit(1)
    
    main()
