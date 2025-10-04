# ⚡ Rychlý start - Baby Eventlook

## 🚀 Spuštění za 30 sekund

```bash
# 1. Klonujte repository
git clone <your-repo-url>
cd eventlook-app

# 2. Spusťte aplikaci
docker-compose up

# 3. Otevřete prohlížeč
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

## 🎯 Co můžete dělat

1. **Prohlížet události** - Seznam všech dostupných akcí
2. **Kupovat lístky** - Klikněte na "Koupit lístky" u libovolné události
3. **Spravovat nákupy** - Zobrazit a vymazat zakoupené lístky

## 🛑 Zastavení

```bash
# Zastavit všechny kontejnery
docker-compose down

# Zastavit a smazat data
docker-compose down -v
```

## ❓ Problémy?

- **Porty obsazené?** Zkontrolujte, že porty 3000, 3001, 5432 jsou volné
- **Docker neběží?** Spusťte Docker Desktop
- **Chyby?** Zkuste `docker-compose logs` pro diagnostiku

---

**Aplikace je připravena k použití!** 🎫
