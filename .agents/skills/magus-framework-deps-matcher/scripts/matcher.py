#!/usr/bin/env python3
"""
通用依赖匹配器 - 增强版
支持:
1. 自然语言理解、同义词匹配、功能匹配
2. 检查依赖是否已在 Framework 中
3. 检查依赖是否已在当前项目 pom.xml 中
4. 防止重复添加依赖
"""

import sys
import json
import re
import xml.etree.ElementTree as ET
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Set

# ============================================================
# 加载配置
# ============================================================

def load_dependency_map() -> Dict:
    """加载依赖映射配置"""
    config_path = Path(__file__).parent / 'dependency_map.yaml'
    if config_path.exists():
        with open(config_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f) or {}
    return {}

# ============================================================
# 查找 Framework 报告
# ============================================================

def find_framework_report(start_path: Path = None) -> Optional[Path]:
    """向上查找 framework-deps.html"""
    if start_path is None:
        start_path = Path.cwd()

    # 当前目录
    current = start_path / 'framework-deps.html'
    if current.exists():
        return current

    # 向上查找
    current_dir = start_path
    for _ in range(5):
        if (current_dir / 'framework-deps.html').exists():
            return current_dir / 'framework-deps.html'
        if (current_dir / 'framework' / 'framework-deps.html').exists():
            return current_dir / 'framework' / 'framework-deps.html'
        if current_dir.parent == current_dir:
            break
        current_dir = current_dir.parent

    return None

def parse_report(html_path: Path) -> Dict[str, Dict]:
    """
    从 HTML 中提取可用依赖列表
    返回: {artifactId: {groupId, version, scope, ...}}
    """
    html = html_path.read_text(encoding='utf-8')
    deps = {}

    # 提取表格中的依赖信息
    # 查找所有行
    row_pattern = r'<tr[^>]*>(.*?)</tr>'
    rows = re.findall(row_pattern, html, re.DOTALL)

    for row in rows:
        # 提取 artifactId
        name_match = re.search(r'<td class="dep-name"><code>([^<]+)</code></td>', row)
        if not name_match:
            continue
        artifact_id = name_match.group(1).strip()

        # 提取 groupId
        group_match = re.search(r'<td class="dep-group"><code>([^<]+)</code></td>', row)
        group_id = group_match.group(1).strip() if group_match else 'unknown'

        # 提取 version
        version_match = re.search(r'<td class="dep-version"[^>]*>(.*?)</td>', row, re.DOTALL)
        version = 'unknown'
        if version_match:
            version_text = re.sub(r'<[^>]+>', '', version_match.group(1))
            version = version_text.strip()

        # 提取 scope
        scope_match = re.search(r'<td class="dep-scope">([^<]*)</td>', row)
        scope = scope_match.group(1).strip() if scope_match else 'compile'

        deps[artifact_id] = {
            'groupId': group_id,
            'artifactId': artifact_id,
            'version': version,
            'scope': scope
        }

    return deps

def find_project_pom(start_path: Path = None) -> Optional[Path]:
    """查找当前项目的 pom.xml"""
    if start_path is None:
        start_path = Path.cwd()

    # 查找最近的 pom.xml（不包括 Framework 根目录的）
    current_dir = start_path
    for _ in range(10):
        pom_path = current_dir / 'pom.xml'
        if pom_path.exists():
            # 检查是否是 Framework 根目录（包含 framework-common 等子模块）
            content = pom_path.read_text(encoding='utf-8')
            if '<artifactId>framework</artifactId>' in content:
                # 这是 Framework 根，继续向上或返回 None
                pass
            else:
                return pom_path
        if current_dir.parent == current_dir:
            break
        current_dir = current_dir.parent

    return None

def parse_pom_dependencies(pom_path: Path) -> Dict[str, Dict]:
    """
    解析 pom.xml 中的依赖
    返回: {artifactId: {groupId, version, scope, ...}}
    """
    if not pom_path or not pom_path.exists():
        return {}

    try:
        tree = ET.parse(pom_path)
        root = tree.getroot()
    except Exception as e:
        print(f"解析 pom.xml 失败: {e}")
        return {}

    # 处理命名空间
    ns = {'m': 'http://maven.apache.org/POM/4.0.0'}

    deps = {}

    # 查找 dependencies 下的依赖
    for dep in root.findall('.//m:dependencies/m:dependency', ns):
        group_elem = dep.find('m:groupId', ns)
        artifact_elem = dep.find('m:artifactId', ns)
        version_elem = dep.find('m:version', ns)
        scope_elem = dep.find('m:scope', ns)

        if artifact_elem is not None:
            artifact_id = artifact_elem.text
            group_id = group_elem.text if group_elem is not None else 'unknown'
            version = version_elem.text if version_elem is not None else ''
            scope = scope_elem.text if scope_elem is not None else 'compile'

            deps[artifact_id] = {
                'groupId': group_id,
                'artifactId': artifact_id,
                'version': version,
                'scope': scope
            }

    return deps

def find_all_pom_dependencies(start_path: Path = None) -> Dict[str, Dict]:
    """
    查找所有相关 pom.xml 中的依赖（包括 parent 和当前模块）
    """
    all_deps = {}

    if start_path is None:
        start_path = Path.cwd()

    current_dir = start_path
    for _ in range(5):
        pom_path = current_dir / 'pom.xml'
        if pom_path.exists():
            deps = parse_pom_dependencies(pom_path)
            all_deps.update(deps)

            # 检查是否有 parent
            content = pom_path.read_text(encoding='utf-8')
            if '<parent>' not in content:
                break

        if current_dir.parent == current_dir:
            break
        current_dir = current_dir.parent

    return all_deps

# ============================================================
# 匹配器
# ============================================================

class DependencyMatcher:
    def __init__(self):
        self.dependency_map = load_dependency_map()
        self.framework_deps = {}
        self.project_deps = {}

    def load_framework_report(self, report_path: Path):
        """加载 Framework 依赖报告"""
        self.framework_deps = parse_report(report_path)

    def load_project_pom(self, pom_path: Optional[Path] = None):
        """加载当前项目的 pom.xml 依赖"""
        if pom_path is None:
            pom_path = find_project_pom()

        if pom_path:
            self.project_deps = find_all_pom_dependencies(pom_path.parent)
            return pom_path
        return None

    def extract_keywords(self, user_input: str) -> List[Tuple[str, Dict]]:
        """从用户输入中提取关键词并匹配依赖"""
        input_lower = user_input.lower()
        matches = []

        for dep_name, config in self.dependency_map.items():
            for kw in config.get('keywords', []):
                if kw.lower() in input_lower:
                    matches.append((dep_name, config))
                    break

        return matches

    def check_transitive_deps(self, artifact_id: str) -> List[str]:
        """
        检查某个依赖会传递引入哪些 Framework 模块
        """
        transitive = []

        # 定义传递依赖关系
        transitive_map = {
            'framework-persistence-jpa': ['framework-redis', 'framework-common'],
            'framework-stomp': ['framework-redis'],
            'framework-rtdb': ['framework-redis'],
            'framework-pdf': ['framework-redis'],
            'framework-core': ['framework-common'],
            'framework-mq': ['framework-common'],
            'framework-openfeign': ['framework-common', 'framework-core'],
            'framework-grpc-client': ['framework-grpc-lib', 'framework-common'],
        }

        if artifact_id in transitive_map:
            for dep in transitive_map[artifact_id]:
                if dep in self.framework_deps:
                    transitive.append(dep)

        return transitive

    def match(self, user_input: str, check_project: bool = True) -> Dict:
        """
        匹配依赖

        Args:
            user_input: 用户输入
            check_project: 是否检查当前项目 pom.xml
        """
        matches = self.extract_keywords(user_input)

        if not matches:
            return {
                'matched': False,
                'message': '未能识别具体依赖，请明确说明需要什么功能',
                'results': []
            }

        results = []
        for dep_name, config in matches:
            dependency = config.get('dependency', '')

            # 检查 Framework 中是否存在
            in_framework = dependency in self.framework_deps if self.framework_deps else None

            # 检查当前项目中是否已存在
            in_project = dependency in self.project_deps if self.project_deps else None

            # 检查传递依赖
            transitive_deps = []
            if in_framework and not in_project:
                transitive_deps = self.check_transitive_deps(dependency)
                # 过滤掉项目中已存在的
                transitive_deps = [d for d in transitive_deps if d not in self.project_deps]

            results.append({
                'keyword': dep_name,
                'dependency': dependency,
                'description': config.get('description', ''),
                'config_example': config.get('config_example', ''),
                'in_framework': in_framework,
                'in_project': in_project,
                'transitive_deps': transitive_deps,
                'related_starters': config.get('related_starters', [])
            })

        return {
            'matched': True,
            'results': results,
            'message': self._format_results(results, check_project)
        }

    def _format_results(self, results: List[Dict], check_project: bool) -> str:
        """格式化结果"""
        lines = []
        lines.append("=" * 60)
        lines.append("📦 依赖检查结果")
        lines.append("=" * 60)

        for r in results:
            dep = r['dependency']

            # 状态判断
            if r['in_project']:
                status = "✅ 已存在"
                status_detail = f"已在当前项目 pom.xml 中"
            elif r['in_framework']:
                status = "📦 Framework 可用"
                status_detail = f"在 Framework 中，可直接使用"
            else:
                status = "❌ 需要添加"
                status_detail = "不在 Framework 中，需要手动添加"

            lines.append(f"\n{dep}")
            lines.append(f"   状态: {status}")
            lines.append(f"   说明: {r['description']}")

            if status_detail:
                lines.append(f"   详情: {status_detail}")

            # 传递依赖提示
            if r['transitive_deps']:
                lines.append(f"   传递依赖: 会同时引入 {', '.join(r['transitive_deps'])}")

            # 配置示例
            if r['config_example'] and not r['in_project']:
                lines.append("   配置示例:")
                for line in r['config_example'].strip().split('\n'):
                    lines.append(f"      {line}")

            # 状态分隔

        # 添加建议
        lines.append("\n" + "-" * 60)
        lines.append("💡 建议:")

        for r in results:
            dep = r['dependency']
            if r['in_project']:
                lines.append(f"   • {dep}: 无需操作，依赖已存在")
            elif r['in_framework']:
                lines.append(f"   • {dep}: 在 pom.xml 中添加以下依赖:")
                lines.append(f"       <dependency>")
                lines.append(f"           <groupId>com.magus.cloud</groupId>")
                lines.append(f"           <artifactId>{dep}</artifactId>")
                lines.append(f"       </dependency>")
            else:
                lines.append(f"   • {dep}: 需要手动查找并添加对应的 Maven 依赖")

        lines.append("-" * 60)

        return '\n'.join(lines)

    def check_before_add(self, artifact_id: str) -> Dict:
        """
        在添加依赖前检查
        返回: {
            'can_add': bool,
            'reason': str,
            'existing': Dict or None
        }
        """
        # 标准化 artifact_id
        artifact_id = artifact_id.strip()

        # 1. 检查是否已在当前项目中
        if artifact_id in self.project_deps:
            return {
                'can_add': False,
                'reason': f'{artifact_id} 已在当前项目的 pom.xml 中存在',
                'existing': self.project_deps[artifact_id]
            }

        # 2. 检查传递依赖
        for dep_id, dep_info in self.project_deps.items():
            transitive = self.check_transitive_deps(dep_id)
            if artifact_id in transitive:
                return {
                    'can_add': False,
                    'reason': f'{artifact_id} 会通过 {dep_id} 传递引入，无需重复添加',
                    'existing': dep_info
                }

        # 3. 检查是否在 Framework 中
        if artifact_id in self.framework_deps:
            return {
                'can_add': True,
                'reason': f'{artifact_id} 在 Framework 中可用，建议添加',
                'existing': None
            }

        # 4. 不在 Framework 中
        return {
            'can_add': True,
            'reason': f'{artifact_id} 不在 Framework 中，需要手动添加',
            'existing': None,
            'warning': True
        }

# ============================================================
# 主函数
# ============================================================

def main():
    if len(sys.argv) < 2:
        print("用法: matcher.py <用户需求或artifactId> [选项]")
        print("示例:")
        print("  matcher.py '添加 Redis 缓存功能'")
        print("  matcher.py framework-redis --check")
        sys.exit(1)

    # 解析参数
    user_need = sys.argv[1]
    check_mode = '--check' in sys.argv
    json_mode = '--json' in sys.argv

    matcher = DependencyMatcher()

    # 查找并加载 Framework 报告
    report_path = find_framework_report()
    if report_path:
        matcher.load_framework_report(report_path)
        print(f"📄 Framework 报告: {report_path}")
    else:
        print("⚠️ 未找到 framework-deps.html")
        print("💡 请先在 Framework 项目中运行分析器生成报告")

    # 加载当前项目 pom.xml
    project_pom = matcher.load_project_pom()
    if project_pom:
        print(f"📄 当前项目: {project_pom}")
        print(f"   已存在依赖: {len(matcher.project_deps)} 个")
    else:
        print("⚠️ 未找到当前项目的 pom.xml（在项目根目录外运行）")

    print()

    # 执行匹配
    if check_mode:
        # 检查模式：直接检查 artifactId
        result = matcher.check_before_add(user_need)
        print(f"🔍 检查: {user_need}")
        print(f"   结果: {'✅ 可以添加' if result['can_add'] else '❌ 无需添加'}")
        print(f"   原因: {result['reason']}")
        if result.get('existing'):
            print(f"   现有: {result['existing']}")
    else:
        # 正常模式：语义匹配
        result = matcher.match(user_need)
        print(result['message'])

    # 输出 JSON
    if json_mode:
        print("\n--- JSON ---")
        print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
