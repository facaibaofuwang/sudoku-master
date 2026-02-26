#!/usr/bin/env python3
"""
Android 应用图标生成器
使用 PIL/Pillow 生成各种尺寸的图标
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont

def create_sudoku_icon(size, output_path):
    """创建数独风格的图标"""
    
    # 创建图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 计算缩放因子
    scale = size / 1024
    
    # 背景圆形
    center = size // 2
    radius = int(480 * scale)
    
    # 渐变效果（使用同心圆模拟）
    for i in range(radius, 0, -2):
        ratio = i / radius
        r = int(79 + (37-79) * ratio)   # 4f46e5 -> 2563eb
        g = int(70 + (99-70) * ratio)
        b = int(229 + (235-229) * ratio)
        draw.ellipse([center-i, center-i, center+i, center+i], fill=(r, g, b, 255))
    
    # 外边框
    border_radius = int(440 * scale)
    draw.ellipse([center-border_radius, center-border_radius, 
                  center+border_radius, center+border_radius],
                 outline=(255, 255, 255, 51), width=int(4*scale))
    
    # 3x3 网格区域
    grid_size = int(600 * scale)
    grid_left = (size - grid_size) // 2
    grid_top = (size - grid_size) // 2
    corner_radius = int(24 * scale)
    
    # 网格背景
    draw.rounded_rectangle([grid_left, grid_top, 
                           grid_left+grid_size, grid_top+grid_size],
                          radius=corner_radius, fill=(255, 255, 255, 242))
    
    # 计算单元格大小
    cell_size = grid_size // 9
    
    # 绘制细线
    line_color = (199, 210, 254, 255)  # #c7d2fe
    thick_line_color = (79, 70, 229, 255)  # #4f46e5
    
    for i in range(1, 9):
        x = grid_left + i * cell_size
        y = grid_top + i * cell_size
        width = 3 if i % 3 == 0 else 1
        color = thick_line_color if i % 3 == 0 else line_color
        
        # 竖线
        draw.line([(x, grid_top), (x, grid_top+grid_size)], fill=color, width=int(width*scale))
        # 横线
        draw.line([(grid_left, y), (grid_left+grid_size, y)], fill=color, width=int(width*scale))
    
    # 绘制数字
    numbers = [
        (0, 0, '5', (79, 70, 229)),
        (1, 0, '3', (124, 58, 237)),
        (5, 1, '7', (37, 99, 235)),
        (0, 2, '6', (220, 38, 38)),
        (1, 2, '1', (79, 70, 229)),
        (2, 2, '9', (124, 58, 237)),
        (5, 2, '5', (37, 99, 235)),
        (1, 3, '8', (156, 163, 175)),
        (4, 3, '6', (79, 70, 229)),
        (5, 3, '3', (220, 38, 38)),
        (0, 4, '4', (37, 99, 235)),
        (4, 4, '8', (124, 58, 237)),
        (5, 4, '5', (156, 163, 175)),
        (1, 5, '7', (124, 58, 237)),
        (3, 5, '9', (220, 38, 38)),
    ]
    
    font_size = int(56 * scale)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    for col, row, num, color in numbers:
        x = grid_left + col * cell_size + cell_size // 2
        y = grid_top + row * cell_size + cell_size // 2 - font_size // 3
        draw.text((x, y), num, fill=color + (255,), font=font, anchor="mm")
    
    # 角落装饰
    dot_radius = int(12 * scale)
    corners = [
        (grid_left + 20, grid_top + 20),
        (grid_left + grid_size - 20, grid_top + 20),
        (grid_left + 20, grid_top + grid_size - 20),
        (grid_left + grid_size - 20, grid_top + grid_size - 20),
    ]
    corner_colors = [(79, 70, 229), (124, 58, 237), (37, 99, 235), (79, 70, 229)]
    
    for (x, y), color in zip(corners, corner_colors):
        draw.ellipse([x-dot_radius, y-dot_radius, x+dot_radius, y+dot_radius],
                    fill=color + (77,))
    
    # 保存
    img.save(output_path, 'PNG')
    print(f"✓ 生成: {output_path} ({size}x{size})")

def main():
    # 尺寸配置
    sizes = {
        'mdpi': 48,
        'hdpi': 72,
        'xhdpi': 96,
        'xxhdpi': 144,
        'xxxhdpi': 192,
    }
    
    # 创建输出目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    res_dir = os.path.join(base_dir, '..', 'android', 'app', 'src', 'main', 'res')
    
    # 生成各尺寸图标
    for density, size in sizes.items():
        # 普通图标
        output_dir = os.path.join(res_dir, f'mipmap-{density}')
        os.makedirs(output_dir, exist_ok=True)
        create_sudoku_icon(size, os.path.join(output_dir, 'ic_launcher.png'))
        
        # 圆形图标（Android 7.1+）
        create_sudoku_icon(size, os.path.join(output_dir, 'ic_launcher_round.png'))
    
    # 生成 512x512 商店图标
    store_dir = os.path.join(base_dir, '..')
    os.makedirs(store_dir, exist_ok=True)
    create_sudoku_icon(512, os.path.join(store_dir, 'play_store_icon.png'))
    
    # 生成 1024x1024 源文件
    create_sudoku_icon(1024, os.path.join(store_dir, 'icon_source_1024.png'))
    
    print("\n✅ 所有图标生成完成!")
    print(f"📁 输出目录: {res_dir}")

if __name__ == '__main__':
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("请先安装 Pillow: pip install Pillow")
        sys.exit(1)
    
    main()
