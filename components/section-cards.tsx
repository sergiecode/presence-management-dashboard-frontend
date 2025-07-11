import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function SectionCards() {
  const glass: React.CSSProperties = {
    background: "rgba(0, 0, 0, 0.81)",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(16.4px)",
    WebkitBackdropFilter: "blur(16.4px)",
    border: "1px solid rgba(0, 0, 0, 0.3)",
  };

  // Datos para el gráfico de pastel
  const chartData = [
    { browser: "Activos", visitors: 145, fill: "var(--chart-1)" },
    { browser: "Inactivos", visitors: 5, fill: "var(--chart-2)" },
    { browser: "Pendientes", visitors: 3, fill: "var(--chart-3)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    Activos: {
      label: "Activos",
      color: "var(--chart-1)",
    },
    Inactivos: {
      label: "Inactivos",
      color: "var(--chart-2)",
    },
    Pendientes: {
      label: "Pendientes",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      {/* Sección de Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card" style={glass}>
          <CardHeader>
            <CardDescription>Total Empleados</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              150
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              +2 desde el mes pasado
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card" style={glass}>
          <CardHeader>
            <CardDescription>Activos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              145
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
              96.7% tasa de productividad
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card" style={glass}>
          <CardHeader>
            <CardDescription>Registros Pendientes</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              3
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Esperando aprobación
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card" style={glass}>
          <CardHeader>
            <CardDescription>Registros de asistencias</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              98
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {145 - 98} pendientes
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Gráfico de Pastel */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols gap-4 px-4">
        <Card className="mt-4 w-full" style={glass}>
          <CardHeader className="items-center pb-0">
            <CardTitle>Asistencia de Empleados</CardTitle>
            <CardDescription>Estado actual</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="visitors"
                  nameKey="browser"
                  label={({ name, percent }) => {
                    if (name && percent !== undefined) {
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }
                    return "";
                  }}

                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="text-muted-foreground leading-none">
              Distribución actual de empleados por estado
            </div>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}