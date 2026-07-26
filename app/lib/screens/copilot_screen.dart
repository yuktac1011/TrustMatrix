import 'dart:async';
import 'package:flutter/material.dart';
import '../services/simulation_service.dart';
import '../models/copilot_message.dart';

class CopilotScreen extends StatefulWidget {
  const CopilotScreen({super.key});

  @override
  State<CopilotScreen> createState() => _CopilotScreenState();
}

class _CopilotScreenState extends State<CopilotScreen> {
  final TextEditingController _promptController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isListening = false;

  void _sendMessage([String? overrideText]) {
    final text = overrideText ?? _promptController.text.trim();
    if (text.isEmpty) return;

    SimulationService().sendCopilotPrompt(text);
    _promptController.clear();
    _scrollToBottom();
  }

  void _simulateVoiceToText() {
    setState(() => _isListening = true);

    Timer(const Duration(seconds: 2), () {
      if (!mounted) return;
      setState(() => _isListening = false);
      const simulatedSpeech = "Summarize Alert #492 in 3 bullet points";
      _promptController.text = simulatedSpeech;
      _sendMessage(simulatedSpeech);
    });
  }

  void _scrollToBottom() {
    Timer(const Duration(milliseconds: 300), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final sim = SimulationService();

    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF09090B),
        elevation: 0,
        title: const Row(
          children: [
            Icon(Icons.smart_toy, color: Color(0xFFA78BFA), size: 22),
            SizedBox(width: 8),
            Text(
              "MOBILE SOC CO-PILOT",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1.0),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Voice listening notification banner
            if (_isListening)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                color: const Color(0xFF7C3AED),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.mic, color: Colors.white, size: 18),
                    SizedBox(width: 8),
                    Text(
                      "Listening... (Voice-to-Text Speech Recognition)",
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ],
                ),
              ),

            // Quick Prompt Pills
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  _buildPromptPill("Summarize Alert #492"),
                  _buildPromptPill("Show MITRE ATT&CK Mapping"),
                  _buildPromptPill("Summarize Threat Level"),
                  _buildPromptPill("Recommend Containment"),
                ],
              ),
            ),

            // Chat Messages Feed
            Expanded(
              child: ListenableBuilder(
                listenable: sim,
                builder: (context, _) {
                  final messages = sim.copilotMessages;
                  return ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(12),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final msg = messages[index];
                      return _buildMessageBubble(msg);
                    },
                  );
                },
              ),
            ),

            // Bottom Input Bar
            Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Color(0xFF12131A),
                border: Border(top: BorderSide(color: Color(0xFF1E202E))),
              ),
              child: Row(
                children: [
                  // Voice Mic Button
                  IconButton(
                    icon: Icon(
                      Icons.mic,
                      color: _isListening ? const Color(0xFFEF4444) : const Color(0xFFA78BFA),
                    ),
                    tooltip: "Voice Command Input",
                    onPressed: _simulateVoiceToText,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: TextField(
                      controller: _promptController,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: InputDecoration(
                        hintText: "Ask AI Copilot or tap microphone...",
                        hintStyle: const TextStyle(color: Colors.white38, fontSize: 13),
                        filled: true,
                        fillColor: const Color(0xFF1E202E),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 6),
                  IconButton(
                    icon: const Icon(Icons.send, color: Color(0xFF7C3AED)),
                    onPressed: () => _sendMessage(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPromptPill(String text) {
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: ActionChip(
        label: Text(text),
        onPressed: () => _sendMessage(text),
        backgroundColor: const Color(0xFF1E202E),
        side: const BorderSide(color: Color(0xFF7C3AED)),
        labelStyle: const TextStyle(color: Color(0xFFA78BFA), fontSize: 11, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildMessageBubble(CopilotMessage msg) {
    return Align(
      alignment: msg.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.all(14),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
        decoration: BoxDecoration(
          color: msg.isUser ? const Color(0xFF7C3AED) : const Color(0xFF12131A),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: msg.isUser ? const Color(0xFFA78BFA) : const Color(0xFF1E202E),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  msg.isUser ? Icons.person : Icons.smart_toy,
                  size: 14,
                  color: msg.isUser ? Colors.white70 : const Color(0xFFA78BFA),
                ),
                const SizedBox(width: 4),
                Text(
                  msg.isUser ? "Analyst" : "GenAI SOC Copilot",
                  style: TextStyle(
                    color: msg.isUser ? Colors.white70 : const Color(0xFFA78BFA),
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              msg.text,
              style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.4),
            ),
            if (msg.mitreTags != null && msg.mitreTags!.isNotEmpty) ...[
              const SizedBox(height: 10),
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: msg.mitreTags!.map((tag) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF4444).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: const Color(0xFFEF4444)),
                    ),
                    child: Text(
                      tag,
                      style: const TextStyle(color: Color(0xFFEF4444), fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  );
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
