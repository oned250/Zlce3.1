#!/usr/bin/env python3
"""
Unit test suite untuk konsistensi berkas kit ZLCE v3.2
"""

import os
import unittest

class TestZLCEKit(unittest.TestCase):
    def setUp(self):
        self.base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    def test_templates_exist(self):
        templates = [
            "templates/AI_WORKFLOW.template.md",
            "templates/BLUEPRINT.template.md",
            "templates/ARCHITECTURE.template.md",
            "templates/DATA_MODEL.template.md",
            "templates/TASKS.template.md",
            "templates/SESSION_STATE.template.md",
            "templates/TESTING.template.md",
            "templates/CHECKLISTS.template.md",
            "templates/CHANGELOG.template.md",
        ]
        for t in templates:
            path = os.path.join(self.base_dir, t)
            self.assertTrue(os.path.exists(path), f"Template hilang: {t}")

    def test_single_kit_contains_all_files(self):
        single_kit_path = os.path.join(self.base_dir, "ZLCE_KIT_SINGLE.md")
        self.assertTrue(os.path.exists(single_kit_path))
        with open(single_kit_path, "r", encoding="utf-8") as f:
            content = f.read()

        expected_tags = [
            "<<<FILE: LANDING_PROMPT.md>>>",
            "<<<FILE: HANDOVER_PROMPT.md>>>",
            "<<<FILE: templates/AI_WORKFLOW.template.md>>>",
            "<<<FILE: templates/SESSION_STATE.template.md>>>",
        ]
        for tag in expected_tags:
            self.assertIn(tag, content, f"Single kit tidak memuat penanda: {tag}")

    def test_v32_x1_rule_present(self):
        workflow_path = os.path.join(self.base_dir, "templates/AI_WORKFLOW.template.md")
        with open(workflow_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("ATURAN KERAS TIMESTAMP", content)
        self.assertIn("jam: ?", content)

if __name__ == "__main__":
    unittest.main()
