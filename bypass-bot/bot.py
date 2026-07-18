"""
KING BYPASS — Bot de Discord con bypass, executors y utilidades
Diseño: loader con emojis animados, éxito verde, error rojo.
Comandos: /bypass, /setupautobypass, /executor list, /set, /ping, /suported, /say, /help
"""

import os
import re
import json
import time
import asyncio
import logging
import threading
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import quote

import discord
from discord import app_commands
from discord.ui import Button, View
import requests
import aiohttp

from dotenv import load_dotenv
load_dotenv()

# ── LOGGING ──────────────────────────────────────────────────────
logger = logging.getLogger("KING_BYPASS")
logger.setLevel(logging.INFO)
_handler = logging.StreamHandler()
_handler.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s: %(message)s", "%Y-%m-%d %H:%M:%S"))
logger.addHandler(_handler)

# ── CONFIG ───────────────────────────────────────────────────────
TOKEN = os.environ.get("DISCORD_TOKEN", "")
PORT = int(os.environ.get("PORT", "8080"))
SUPPORT_SERVER_URL = "https://discord.gg/AvsRrp5EX6"
BOT_INVITE_URL = os.environ.get("BOT_INVITE_URL", "https://discord.com/oauth2/authorize?client_id=1525040833814855710")

BYPASS_API_URL = "https://4pi-bypass.vercel.app/api/bypass?url="
BYPASS_TIMEOUT = 30
BYPASS_RETRIES = 5  # Aumentado para mejor manejo de errores
BYPASS_DELAY = 3

AUTOBYPASS_FILE = "autobypass_channels.json"
EXECUTOR_CONFIG_FILE = "executor_config.json"

# ── EMOJIS ANIMADOS (IDs proporcionados) ──────────────────────
EMOJI = {
    # Verdes / éxito
    "greendot": "<:greendot:1525383175889485848>",
    "success": "<a:success:1525379448768303207>",
    "Green_Siren": "<a:Green_Siren:1526856177055563826>",
    "GreenCrown": "<a:GreenCrown:1526742765311098980>",
    "GreenDot": "<a:GreenDot:1526742445323190272>",
    "glowing_dot_green": "<:glowing_dot_green:1525383175889485848>",
    "LightningGreen": "<:LightningGreen:1525379640498065538>",
    "neon_greenapple": "<:neon_greenapple:1526854612244631643>",
    "LimeGreenDrippingGlowingCrown": "<:LimeGreenDrippingGlowingCrown:1526854700434198558>",
    
    # Rojos / error
    "failed": "<a:failed:1526857565156147250>",
    "red_siren": "<a:red_siren:1526856057316704317>",
    "RedDot": "<a:RedDot:1526857479294681198>",
    "Warningicon": "<:Warningicon:1526855124134137856>",
    "Attention": "<a:Attention:1526850359958704138>",
    "Alarm": "<a:Alarm:1525787989354086411>",
    "Yellow_Siren": "<a:Yellow_Siren:1526856416692797481>",
    
    # Carga / procesamiento
    "loader": "<a:loader:1526741970226253834>",
    "loader2": "<a:loader:1526856926413979739>",
    "clock": "<a:clock:1525380296852377711>",
    "Cursor_click": "<a:Cursor_click:1526857184116477962>",
    
    # Otros
    "goldenkey": "<:goldenkey:1525381310200414310>",
    "gold_key": "<:gold_key:1526743159038803978>",
    "copy": "<:copy:1525379105111932958>",
    "copy_text": "<:copy_text:1526743644894138479>",
    "link": "<:Link:1525379856034959422>",
    "Discord": "<:Discord:1526743527642501273>",
    "Discordlogo": "<:Discordlogo:1526855246897348741>",
    "ticket": "<:ticket:1526851476280836256>",
    "Information": "<:Information:1526852173852315799>",
    "settings": "<:settings:1526853210231410810>",
    "search": "<:search:1526851410283728898>",
    "Search": "<:Search:1526854204218671155>",
    "Admin": "<:Admin:1526850858271248384>",
    "Owner": "<:Owner:1526850915418509362>",
    "Member": "<:Member:1526851357330505822>",
    "GreenMember": "<:GreenMember:1526855758686322697>",
    "Role": "<:Role:1526853667502948443>",
    "emojigg_Mod": "<:emojigg_Mod:1526851052933222420>",
    "emojigg_PC": "<:emojigg_PC:1526858555544572035>",
    "Money": "<a:Money:1526852670743380031>",
    "BitCash": "<a:BitCash:1526850558726508564>",
    "GoldenSpinCoin": "<a:GoldenSpinCoin:1526850486387605504>",
    "Giveaway": "<a:Giveaway:1526817132501798983>",
    "Gift": "<a:Gift:1526817190660280360>",
    "Diamond": "<a:Diamond:1526858613572894780>",
    "CameraRedLogo": "<a:CameraRedLogo:1526854158680981504>",
    "Awesomeface14": "<a:Awesomeface14:1526850663575982222>",
    "clown": "<a:clown:1526858087510835252>",
    "lovemail": "<a:lovemail:1526859184900018228>",
    "matamison": "<a:matamison:1526857044068667456>",
    "DarkBlueArrow": "<a:DarkBlueArrow:1526850610547396690>",
    "Cart": "<:Cart:1526854833125195786>",
    "House": "<:House:1526854349110640690>",
    "phone": "<:phone:1526858219958567003>",
    "point": "<:point:1526853458798313573>",
    "voice_invite": "<:voice_invite:1526743390488756236>",
}

# ── IMÁGENES PARA LOADER ───────────────────────────────────────
LOADER_EMOJI_URL = "https://cdn.discordapp.com/emojis/1527874392959352892.webp?size=100&animated=true"
PROCESSING_GIF_URL = "https://cdn.discordapp.com/emojis/1527874318854524978.webp?size=100&animated=true"
BYPASS_BANNER = "https://cdn.discordapp.com/attachments/1525428259905474611/1527595443478073394/ezgif-172219562b2b27ff.gif?ex=6a5be45f&is=6a5a92df&hm=b960aaca8ec53d4c4f2cce86d7076277581a8bb4ca856ba63944002473581254&"

# ── COLORES ──────────────────────────────────────────────────────
C_LOADING = 0xFEE75C   # amarillo
C_SUCCESS = 0x57F287   # verde
C_ERROR   = 0xED4245   # rojo
C_INFO    = 0x5865F2   # azul

# ── HELPERS ──────────────────────────────────────────────────────
_URL_RE = re.compile(r"https?://[^\s<>\"']{6,}")

def _is_url(u: str) -> bool:
    return bool(re.match(r"^https?://\S{6,}", u))

def _footer(extra: str = "") -> str:
    base = f"KING BYPASS • {datetime.now(timezone.utc).strftime('%H:%M UTC')}"
    return f"{base} - {extra}" if extra else base

def _uptime() -> str:
    delta = datetime.now(timezone.utc) - BOT_START
    t = int(delta.total_seconds())
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{h}h {m}m {s}s"

BOT_START = datetime.now(timezone.utc)

# ── JSON HELPERS ─────────────────────────────────────────────────
def load_json(path, default):
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return default

def save_json(path, data):
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.warning(f"save_json: {e}")

# ── AUTO-BYPASS CHANNELS ────────────────────────────────────────
autobypass_channels: set = set(load_json(AUTOBYPASS_FILE, []))
def _save_ab(): save_json(AUTOBYPASS_FILE, list(autobypass_channels))

# ── EXECUTOR CONFIG ─────────────────────────────────────────────
executor_config: dict = load_json(EXECUTOR_CONFIG_FILE, {})  # {guild_id: channel_id}
def _save_executor(): save_json(EXECUTOR_CONFIG_FILE, executor_config)

# ── BYPASS ENGINE ───────────────────────────────────────────────
_KEYS = ("content","result","loadstring","bypassed","bypassed_link",
         "bypassed_url","final_url","destination","url","link","key","output")

def _bypass_sync(url: str):
    """Función síncrona para llamar a la API de bypass con reintentos."""
    last_err = "Error desconocido"
    user_agents = [
        "KingBypass/2.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "curl/8.0.1"
    ]
    
    for attempt in range(1, BYPASS_RETRIES + 1):
        try:
            session = requests.Session()
            session.headers.update({"User-Agent": user_agents[attempt % len(user_agents)]})
            
            full_url = BYPASS_API_URL + quote(url, safe="")
            resp = session.get(full_url, timeout=BYPASS_TIMEOUT)
            
            # Si es 401, esperar y reintentar con otro User-Agent
            if resp.status_code == 401:
                last_err = f"HTTP 401 - La API está ocupada, reintentando... (Intento {attempt}/{BYPASS_RETRIES})"
                logger.warning(f"[BYPASS] 401 en intento {attempt}, reintentando...")
                if attempt < BYPASS_RETRIES:
                    time.sleep(BYPASS_DELAY * attempt)  # Espera progresiva
                    continue
                return None, last_err
            
            if resp.status_code != 200:
                last_err = f"HTTP {resp.status_code}"
                if attempt < BYPASS_RETRIES:
                    time.sleep(BYPASS_DELAY)
                    continue
                return None, last_err
                
            try:
                data = resp.json()
            except Exception:
                txt = resp.text.strip()
                if txt.startswith("http"):
                    return txt, None
                last_err = "Respuesta inválida de la API"
                if attempt < BYPASS_RETRIES:
                    time.sleep(BYPASS_DELAY)
                    continue
                return None, last_err
                
            # Verificar si la API devolvió error
            if isinstance(data, dict):
                if data.get("success") is False or data.get("error"):
                    last_err = data.get("message") or data.get("error") or "Error de la API"
                    if attempt < BYPASS_RETRIES:
                        time.sleep(BYPASS_DELAY)
                        continue
                    return None, last_err
                    
                # Buscar el resultado en las claves conocidas
                for key in _KEYS:
                    if key in data:
                        value = data[key]
                        if isinstance(value, str) and value.strip():
                            return value.strip(), None
                            
            # Si llegamos aquí, no encontramos resultado
            last_err = "No se encontró resultado en la respuesta"
            if attempt < BYPASS_RETRIES:
                time.sleep(BYPASS_DELAY)
                continue
            return None, last_err
            
        except requests.exceptions.Timeout:
            last_err = f"Timeout ({BYPASS_TIMEOUT}s)"
            if attempt < BYPASS_RETRIES:
                time.sleep(BYPASS_DELAY)
                continue
        except requests.exceptions.ConnectionError:
            last_err = "Error de conexión con la API"
            if attempt < BYPASS_RETRIES:
                time.sleep(BYPASS_DELAY)
                continue
        except Exception as ex:
            last_err = str(ex)[:100]
            if attempt < BYPASS_RETRIES:
                time.sleep(BYPASS_DELAY)
                continue
                
    return None, last_err

# ── EMBEDS BYPASS (con emojis animados) ──────────────────────

def embed_loading(url: str, user: discord.User) -> discord.Embed:
    embed = discord.Embed(
        title=f"{EMOJI['greendot']} **KING BOT • BYPASS**",
        description=(
            f"{EMOJI['clock']} **Processing URL**\n"
            f"{EMOJI['loader']} **Please wait...**\n\n"
            f"🔗 **URL:**\n```{url[:200]}```\n\n"
            f"{EMOJI['Green_Siren']} **Status:** Conectando con el servidor..."
        ),
        color=C_LOADING,
        timestamp=discord.utils.utcnow()
    )
    embed.set_thumbnail(url=LOADER_EMOJI_URL)
    embed.set_image(url=PROCESSING_GIF_URL)
    embed.set_footer(text=_footer())
    return embed

def embed_success(result: str, elapsed: float, url: str, user: discord.User) -> discord.Embed:
    embed = discord.Embed(
        title=f"{EMOJI['greendot']} **KING BOT • BYPASS**",
        description=f"{EMOJI['success']} **¡Link procesado exitosamente!**",
        color=C_SUCCESS,
        timestamp=discord.utils.utcnow()
    )
    embed.add_field(
        name=f"{EMOJI['goldenkey']} **Resultado:**",
        value=f"```\n{result[:1000]}\n```",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['goldenkey']} **Resultado (Móvil):**",
        value=f"`{result[:500]}`",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['clock']} **Velocidad:**",
        value=f"`{elapsed:.2f}s`",
        inline=True
    )
    embed.add_field(
        name=f"{EMOJI['GreenDot']} **Solicitado por:**",
        value=user.mention,
        inline=True
    )
    embed.add_field(
        name=f"{EMOJI['GreenCrown']} **Estado:**",
        value="✅ Completado",
        inline=True
    )
    embed.set_image(url=BYPASS_BANNER)
    embed.set_footer(text=_footer())
    return embed

def embed_error(error: str, elapsed: float, url: str, user: discord.User) -> discord.Embed:
    embed = discord.Embed(
        title=f"{EMOJI['failed']} **KING BOT • ERROR**",
        description=f"{EMOJI['red_siren']} **¡Oops! Algo salió mal.**",
        color=C_ERROR,
        timestamp=discord.utils.utcnow()
    )
    embed.add_field(
        name="🔗 **URL:**",
        value=f"```{url[:200]}```",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['Warningicon']} **Error:**",
        value=f"```diff\n- {error or 'Error desconocido'}\n```",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['Attention']} **Solución:**",
        value="• Verifica que el enlace sea válido\n• Intenta de nuevo más tarde\n• Si el error persiste, contacta soporte",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['clock']} **Tiempo:**",
        value=f"`{elapsed:.2f}s`",
        inline=True
    )
    embed.add_field(
        name=f"{EMOJI['RedDot']} **Estado:**",
        value="❌ Fallido",
        inline=True
    )
    embed.set_image(url=BYPASS_BANNER)
    embed.set_footer(text=_footer())
    return embed

# ── VIEWS ───────────────────────────────────────────────────────

class BypassView(View):
    def __init__(self, result: str, elapsed: float):
        super().__init__(timeout=None)
        self._result = result
        self.add_item(Button(
            label=f"⏱ {elapsed:.2f}s",
            style=discord.ButtonStyle.secondary,
            disabled=True,
            row=0
        ))
        self.add_item(Button(
            label="Add Bot",
            emoji=EMOJI['link'],
            url=BOT_INVITE_URL,
            style=discord.ButtonStyle.link,
            row=0
        ))
        self.add_item(Button(
            label="Server",
            emoji=EMOJI['Discord'],
            url=SUPPORT_SERVER_URL,
            style=discord.ButtonStyle.link,
            row=0
        ))

    @discord.ui.button(label="Copy", emoji=EMOJI['copy'], style=discord.ButtonStyle.success, row=1)
    async def copy_button(self, interaction: discord.Interaction, _):
        await interaction.response.send_message(
            f"```txt\n{self._result[:1900]}\n```",
            ephemeral=True
        )

class FailView(View):
    def __init__(self, elapsed: float):
        super().__init__(timeout=None)
        self.add_item(Button(
            label=f"⏱ {elapsed:.2f}s",
            style=discord.ButtonStyle.secondary,
            disabled=True,
            row=0
        ))
        self.add_item(Button(
            label="Server",
            emoji=EMOJI['Discord'],
            url=SUPPORT_SERVER_URL,
            style=discord.ButtonStyle.link,
            row=0
        ))

# ── BOT CLIENT ──────────────────────────────────────────────────

class KingBot(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)
        self._executor_task = None

    async def setup_hook(self):
        await self.tree.sync()
        logger.info("✅ Global commands synced!")

    async def on_ready(self):
        logger.info(f"✅ {self.user} online | {len(self.guilds)} servers")
        await self.change_presence(activity=discord.Activity(
            type=discord.ActivityType.listening, name="/help • KING BYPASS"
        ))
        if self._executor_task is None:
            self._executor_task = asyncio.create_task(self._executor_loop())

    async def on_message(self, message: discord.Message):
        if message.author.bot or not message.guild:
            return
        if message.channel.id in autobypass_channels:
            urls = _URL_RE.findall(message.content)
            if urls:
                await self._handle_autobypass(message, urls)

    # ── AUTO-BYPASS ──────────────────────────────────────────────

    async def _handle_autobypass(self, message: discord.Message, urls: list):
        try:
            await message.delete()
        except Exception:
            pass
        for url in urls[:3]:
            if not _is_url(url):
                continue
            try:
                status = await message.channel.send(
                    content=message.author.mention,
                    embed=embed_loading(url, message.author)
                )
            except Exception:
                continue
            t0 = time.time()
            result, error = await asyncio.get_running_loop().run_in_executor(None, _bypass_sync, url)
            elapsed = time.time() - t0
            try:
                if result:
                    await status.edit(
                        content=message.author.mention,
                        embed=embed_success(result, elapsed, url, message.author),
                        view=BypassView(result, elapsed)
                    )
                else:
                    await status.edit(
                        content=message.author.mention,
                        embed=embed_error(error, elapsed, url, message.author),
                        view=FailView(elapsed)
                    )
            except Exception as e:
                logger.warning(f"Auto-bypass edit error: {e}")

    # ── EXECUTOR LOOP ────────────────────────────────────────────

    async def _executor_loop(self):
        await self.wait_until_ready()
        WEAO_EXPLOITS = "https://weao.xyz/api/status/exploits"
        WEAO_VERSIONS = "https://weao.xyz/api/versions/current"
        cache = {"exploits": {}, "versions": {}}

        while not self.is_closed():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(WEAO_EXPLOITS, timeout=15) as resp:
                        new_exploits = await resp.json() if resp.status == 200 else None
                    async with session.get(WEAO_VERSIONS, timeout=15) as resp:
                        new_versions = await resp.json() if resp.status == 200 else None

                embeds = []
                if new_exploits:
                    for item in new_exploits:
                        title = item.get("title", "Desconocido")
                        prev = cache["exploits"].get(title)
                        if prev:
                            changed = any(item.get(k) != prev.get(k) for k in ("version", "detected", "updateStatus", "rbxversion"))
                            if changed:
                                embed, view = self._build_executor_embed(
                                    title=title,
                                    version=item.get("version", "N/A"),
                                    status="🟢 Online" if item.get("detected") != "Offline" else "🔴 Offline",
                                    url=item.get("url", "")
                                )
                                embeds.append((embed, view))
                        cache["exploits"][title] = item

                if new_versions:
                    for plat in ("Windows", "Mac", "Android", "iOS"):
                        old = cache["versions"].get(plat)
                        new = new_versions.get(plat)
                        if old and new and old != new:
                            embed, view = self._build_executor_embed(
                                title=plat,
                                version=new,
                                status="🟢 Online",
                                url=""
                            )
                            embeds.append((embed, view))
                    cache["versions"] = new_versions

                if embeds:
                    for guild_id, ch_id in executor_config.items():
                        guild = self.get_guild(int(guild_id))
                        if guild:
                            channel = guild.get_channel(int(ch_id))
                            if channel:
                                for embed, view in embeds:
                                    try:
                                        await channel.send(embed=embed, view=view)
                                    except Exception as e:
                                        logger.warning(f"Executor send error: {e}")

            except Exception as e:
                logger.warning(f"Executor loop error: {e}")

            await asyncio.sleep(300)  # 5 min

    def _build_executor_embed(self, title: str, version: str, status: str, url: str):
        embed = discord.Embed(
            title=f"{EMOJI['greendot']} **KING BOT • UPDATE**",
            description=f"{EMOJI['Green_Siren']} **🚀 New Executor Available**",
            color=C_SUCCESS,
            timestamp=discord.utils.utcnow()
        )
        embed.add_field(
            name=f"{EMOJI['emojigg_PC']} **Executor:**",
            value=f"`{title}`",
            inline=False
        )
        embed.add_field(
            name=f"{EMOJI['GreenDot']} **Status:**",
            value=status,
            inline=False
        )
        if version and version != "N/A":
            embed.add_field(
                name=f"{EMOJI['goldenkey']} **Version:**",
                value=f"`{version}`",
                inline=False
            )
        embed.add_field(
            name=f"{EMOJI['GreenCrown']} **CREATED BY KING**",
            value=" ",
            inline=False
        )
        embed.set_footer(text="🤖 KING SYSTEM")
        
        view = View()
        if url:
            view.add_item(Button(label="⬇️ Download", url=url, style=discord.ButtonStyle.link))
        view.add_item(Button(label="💬 Discord", url=SUPPORT_SERVER_URL, style=discord.ButtonStyle.link))
        return embed, view


bot = KingBot()

# ── COMANDOS SLASH ──────────────────────────────────────────────

# 1. /bypass
@bot.tree.command(name="bypass", description="🔗 Bypass un enlace y obtén el destino real")
@app_commands.describe(url="El enlace a bypasear")
async def bypass_cmd(interaction: discord.Interaction, url: str):
    if not _is_url(url):
        e = discord.Embed(
            description=f"{EMOJI['Attention']} **URL inválida.**\nProvee un enlace `http://` o `https://` válido.",
            color=C_ERROR
        )
        e.set_footer(text=_footer())
        return await interaction.response.send_message(embed=e, ephemeral=True)

    await interaction.response.send_message(embed=embed_loading(url, interaction.user))
    t0 = time.time()
    result, error = await asyncio.get_running_loop().run_in_executor(None, _bypass_sync, url)
    elapsed = time.time() - t0

    if result:
        await interaction.edit_original_response(
            embed=embed_success(result, elapsed, url, interaction.user),
            view=BypassView(result, elapsed)
        )
    else:
        await interaction.edit_original_response(
            embed=embed_error(error, elapsed, url, interaction.user),
            view=FailView(elapsed)
        )

# 2. /setupautobypass
@bot.tree.command(name="setupautobypass", description="⚙️ [Admin] Activa/desactiva auto-bypass en este canal")
@app_commands.checks.has_permissions(administrator=True)
async def setupautobypass_cmd(interaction: discord.Interaction):
    cid = interaction.channel_id
    if cid in autobypass_channels:
        autobypass_channels.discard(cid)
        _save_ab()
        embed = discord.Embed(
            title=f"{EMOJI['failed']} **Auto-Bypass Desactivado**",
            description=f"{EMOJI['RedDot']} {interaction.channel.mention} ya no hará bypass automático.",
            color=C_ERROR
        )
    else:
        autobypass_channels.add(cid)
        _save_ab()
        embed = discord.Embed(
            title=f"{EMOJI['greendot']} **Auto-Bypass Activado**",
            description=f"{EMOJI['Green_Siren']} Todos los enlaces en {interaction.channel.mention} serán bypasseados automáticamente.",
            color=C_SUCCESS
        )
    embed.set_footer(text=_footer())
    await interaction.response.send_message(embed=embed, ephemeral=True)

@setupautobypass_cmd.error
async def setupautobypass_error(interaction: discord.Interaction, error: app_commands.AppCommandError):
    if isinstance(error, app_commands.MissingPermissions):
        await interaction.response.send_message("🚫 Necesitas permiso de **Administrador**.", ephemeral=True)

# 3. /executor list
@bot.tree.command(name="executor", description="📋 Lista los executors de Roblox (estado actual)")
async def executor_list_cmd(interaction: discord.Interaction):
    await interaction.response.defer()
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("https://weao.xyz/api/status/exploits", timeout=15) as resp:
                if resp.status != 200:
                    return await interaction.followup.send("❌ No se pudo obtener la lista.", ephemeral=True)
                data = await resp.json()
        embed = discord.Embed(
            title=f"{EMOJI['greendot']} **Executor List**",
            description="Estado actual de los executors de Roblox",
            color=C_INFO,
            timestamp=discord.utils.utcnow()
        )
        for item in data[:10]:
            name = item.get("title", "Desconocido")
            ver = item.get("version", "?")
            status = "🟢 Online" if item.get("detected") != "Offline" else "🔴 Offline"
            embed.add_field(
                name=f"{EMOJI['emojigg_PC']} **{name}**",
                value=f"Versión: `{ver}` | Estado: {status}",
                inline=False
            )
        embed.set_footer(text="🤖 KING SYSTEM")
        await interaction.followup.send(embed=embed)
    except Exception as e:
        await interaction.followup.send(f"❌ Error: `{e}`", ephemeral=True)

# 4. /set
@bot.tree.command(name="set", description="⚙️ [Admin] Configura el canal para avisos de executors")
@app_commands.describe(canal="Canal donde se enviarán las actualizaciones")
@app_commands.checks.has_permissions(administrator=True)
async def set_executor_cmd(interaction: discord.Interaction, canal: discord.TextChannel):
    executor_config[str(interaction.guild_id)] = canal.id
    _save_executor()
    embed = discord.Embed(
        title=f"{EMOJI['greendot']} **Executor Channel Set**",
        description=f"{EMOJI['Green_Siren']} Los avisos se enviarán a {canal.mention}.",
        color=C_SUCCESS
    )
    embed.set_footer(text="🤖 KING SYSTEM")
    await interaction.response.send_message(embed=embed, ephemeral=True)

@set_executor_cmd.error
async def set_executor_error(interaction: discord.Interaction, error: app_commands.AppCommandError):
    if isinstance(error, app_commands.MissingPermissions):
        await interaction.response.send_message("🚫 Necesitas permiso de **Administrador**.", ephemeral=True)

# 5. /ping
@bot.tree.command(name="ping", description="🏓 Ver latencia del bot")
async def ping_cmd(interaction: discord.Interaction):
    ms = round(bot.latency * 1000)
    color = C_SUCCESS if ms < 100 else C_LOADING if ms < 200 else C_ERROR
    embed = discord.Embed(
        title=f"{EMOJI['greendot']} **Pong!**",
        description=f"{EMOJI['clock']} **Latencia:** `{ms}ms`\n{EMOJI['GreenDot']} **Uptime:** `{_uptime()}`",
        color=color
    )
    embed.set_footer(text=_footer())
    await interaction.response.send_message(embed=embed)

# 6. /suported
@bot.tree.command(name="suported", description="📋 Lista de servicios soportados por el bypass")
async def suported_cmd(interaction: discord.Interaction):
    servicios = [
        "Rinku", "Pastelua", "Bstlar", "Anonlink", "Encurtai",
        "Linkify", "LinkUnlocker", "Linkvertise", "Krnl-iOS", "YTSUBME",
        "WorldPopulation", "BloxHub", "PandaDevelopment", "Violated", "Lockrso",
        "Tpi.li", "Luau.pro", "Mboost", "Pastebin", "Sub4Unlock.pro",
        "Lnbz.la", "Pastefy", "Pastedrop", "LooLabs", "Subnise",
        "Luarmor.org", "Platorelay", "Trigon", "Haxscripts", "Rblxscripts2",
        "Boostylink", "LinkGate"
    ]
    chunks = [servicios[i:i+8] for i in range(0, len(servicios), 8)]
    desc = "\n".join(f"{EMOJI['greendot']} " + ", ".join(chunk) for chunk in chunks)
    embed = discord.Embed(
        title=f"{EMOJI['greendot']} **KING BYPASS • Supported Services**",
        description=desc,
        color=C_SUCCESS
    )
    embed.set_footer(text=_footer())
    await interaction.response.send_message(embed=embed)

# 7. /say
@bot.tree.command(name="say", description="📢 [Admin] Hace que el bot envíe un mensaje")
@app_commands.describe(mensaje="Mensaje a enviar")
@app_commands.checks.has_permissions(manage_messages=True)
async def say_cmd(interaction: discord.Interaction, mensaje: str):
    if not mensaje.strip():
        return await interaction.response.send_message("⚠️ El mensaje no puede estar vacío.", ephemeral=True)
    await interaction.response.send_message("✅ Mensaje enviado.", ephemeral=True)
    await interaction.channel.send(mensaje[:2000])

@say_cmd.error
async def say_error(interaction: discord.Interaction, error: app_commands.AppCommandError):
    if isinstance(error, app_commands.MissingPermissions):
        await interaction.response.send_message("🚫 Necesitas permiso **Gestionar Mensajes**.", ephemeral=True)

# 8. /help
@bot.tree.command(name="help", description="📖 Mostrar todos los comandos disponibles")
async def help_cmd(interaction: discord.Interaction):
    embed = discord.Embed(
        title=f"{EMOJI['greendot']} **KING BYPASS • Comandos**",
        description="Lista de comandos disponibles:",
        color=C_INFO,
        timestamp=discord.utils.utcnow()
    )
    embed.add_field(
        name=f"{EMOJI['link']} **Bypass**",
        value="`/bypass <url>`",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['settings']} **Auto-Bypass**",
        value="`/setupautobypass` (Admin)",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['emojigg_PC']} **Executor**",
        value="`/executor list`  `/set <canal>` (Admin)",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['GreenDot']} **Utilidad**",
        value="`/ping`  `/suported`  `/say` (Admin)",
        inline=False
    )
    embed.add_field(
        name=f"{EMOJI['Information']} **Ayuda**",
        value="`/help`",
        inline=False
    )
    embed.set_footer(text=_footer())
    await interaction.response.send_message(embed=embed)

# ── HEALTH SERVER ───────────────────────────────────────────────

class _HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = b'{"status":"online","bot":"KING BYPASS"}'
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def log_message(self, *_): pass

def start_health():
    server = HTTPServer(("0.0.0.0", PORT), _HealthHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    logger.info(f"🌐 Health server on port {PORT}")

# ── ENTRY POINT ─────────────────────────────────────────────────

if __name__ == "__main__":
    if not TOKEN:
        logger.error("❌ DISCORD_TOKEN no configurado.")
        exit(1)
    start_health()
    logger.info("🚀 Iniciando KING BYPASS...")
    bot.run(TOKEN)
