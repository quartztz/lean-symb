//> using scala 3.8.4
//> using dep com.lihaoyi::upickle:4.4.3
//> using dep com.lihaoyi::os-lib:0.11.8
import upickle.default.*
import scala.util.CommandLineParser

def removeCursor(symb: String): String = "\\$CURSOR".r.replaceFirstIn(symb, "☐")

enum Opt:
  case Clean, Group, Merge

given CommandLineParser.FromString[Opt] with
  def fromString(value: String): Opt =
    value match
      case "clean" => Opt.Clean
      case "group" => Opt.Group
      case "merge" => Opt.Merge
      case _       => throw new IllegalArgumentException

def group(in: String, out: String) =
  val data = ujson.read(os.read(os.pwd / in)).obj

  val grpd =
    ujson.Obj.from(
      data.toSeq.sortBy(a => (a._2("cat").str, a._2("abbrevs")(0).str))
    )

  os.write.over(os.pwd / out, ujson.write(grpd))

def merge(in: String, out: String) =
  val data = ujson.read(os.read(os.pwd / in)).obj
  val gt = ujson.read(os.read(os.pwd / "public" / "grouped.json")).obj

  for (symb, _) <- data
  do data(symb)("cat") = gt(symb)("cat")

  os.write.over(os.pwd / out, ujson.write(data))

def clean(in: String, out: String) =
  val data = ujson.read(os.read(os.pwd / in)).obj

  val grpd: Map[String, Map[String, List[String]]] = Map.from(
    data
      .groupBy(_._2.str)
      .map { case (symb, kvs) =>
        removeCursor(symb) -> Map("abbrevs" -> kvs.keys.toList)
      }
  )

  os.write(os.pwd / out, ujson.write(grpd))

@main def main(
    opt: Opt,
    in: String,
    out: String
) =
  opt match
    case Opt.Clean => clean(in, out)
    case Opt.Group => group(in, out)
    case Opt.Merge => merge(in, out)
