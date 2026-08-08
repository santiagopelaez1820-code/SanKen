# Capas de la aplicación

Ver [`docs/01-arquitectura.md`](../../../docs/01-arquitectura.md) en la raíz del monorepo para el detalle completo.

- **Domain/** — entidades, value objects y contratos (interfaces) de negocio. Sin dependencias de Laravel.
- **Application/** — casos de uso (Actions) que orquestan Domain + Infrastructure.
- **Infrastructure/** — implementaciones concretas: repositorios Eloquent, broadcasting, servicios externos.
- **Http/** — controllers, requests, resources, policies. Capa de entrada HTTP, siempre delgada.

Regla de dependencia: `Http → Application → Domain ← Infrastructure`. El binding entre contratos del Domain e implementaciones de Infrastructure se declara en `app/Providers/RepositoryServiceProvider.php`.
